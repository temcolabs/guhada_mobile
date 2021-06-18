import css from './Home.module.scss';
import { Component, Fragment } from 'react';
import Router, { withRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { isNil as _isNil } from 'lodash';
import { mainCategory } from 'childs/lib/constant/category';
import sessionStorage from 'childs/lib/common/sessionStorage';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import isTruthy from 'childs/lib/common/isTruthy';
import { pushRoute } from 'childs/lib/router';
import MainSectionItem from 'components/home/MainSectionItem';
import MainSlideBanner from 'components/home/MainSlideBanner';
import HomeItemDefault from 'components/home/HomeItemDefault';
import MainHotKeyword from 'components/home/MainHotKeyword';
import MainSideBanner from 'components/home/MainSideBanner';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import AppEventPopup from 'components/event/popup/AppEventPopup';
import PointSavingModal, {
  pointSavingTypes,
} from 'components/mypage/point/PointSavingModal';
import BestReview from 'components/home/BestReview';

@withScrollToTopOnMount
@withRouter
@inject('main', 'searchitem', 'eventpopup', 'searchHolder')
@observer
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupModal: false,
      email: '',
      savedPointResponse: {},
    };
  }

  componentDidMount() {
    let { query, asPath } = Router.router;
    const { main } = this.props;
    const category = mainCategory.item.find((item) => {
      return item.href === asPath;
    });

    if (_isNil(category) === false) {
      main.setNavDealId(category.id);
    } else {
      main.setNavDealId(0);
    }

    if (query.home) {
      pushRoute('/');
    }

    let savedPointResponse = sessionStorage.get('signup');

    // 회원가입 성공 모달 표시
    if (isTruthy(savedPointResponse)) {
      this.setState({
        signupModal: true,
        savedPointResponse: savedPointResponse,
      });
      sessionStorage.remove('signup');

      // 회원가입 전환. 로그인한 상태가 아니어서 유저 아이디를 전달할 수 없다.
      widerplanetTracker.signUp({});
    }

    // let cookie = Cookies.get(key.ACCESS_TOKEN);

    this.props.eventpopup.appEventPopupOpen();

    main.getPlusItem();
    main.getNewArrivals();
    main.getHits();
    main.getBestReview();
    main.getHotKeyword();
    main.getMainBannner();
  }

  render() {
    const { main, searchitem, eventpopup, searchHolder } = this.props;

    return (
      <div className={css['wrapper']}>
        <MainSlideBanner imageFile={main.bannerInfo} />

        {/* Focus on items */}
        <MainSideBanner
          title={'FOCUS ON'}
          type={'FOCUS_ON'}
          list={searchHolder.mainImageSetOneSetList}
        />

        {/* Premium Item */}
        <MainSectionItem
          title={'PREMIUM ITEM'}
          items={main.plusItem}
          categoryId={main.navDealId}
          toSearch={searchitem.toSearch}
          condition={'PLUS'}
        />

        {/* 상품 홍보 Large */}
        <MainSideBanner list={searchHolder.mainImageSetTwoSetList} />

        {/* Hok keyword > main */}
        <HomeItemDefault header={'HOT KEYWORD'}>
          <MainHotKeyword
            hotKeyword={main.hotKeyword}
            searchitem={searchitem}
          />
        </HomeItemDefault>

        <MainSectionItem
          title={'BEST ITEM'}
          items={main.hits}
          categoryId={main.navDealId}
          toSearch={searchitem.toSearch}
          condition={'BEST'}
        />

        <HomeItemDefault header={'BEST REVIEW'}>
          <BestReview />
        </HomeItemDefault>

        {/* 상품 홍보 Small */}
        <MainSideBanner list={searchHolder.mainImageSetThreeList} />

        <MainSectionItem
          title={'NEW IN'}
          items={main.newArrivals}
          categoryId={main.navDealId}
          toSearch={searchitem.toSearch}
          condition={'NEW'}
        />

        {/* Hok keyword > main */}
        <HomeItemDefault header={'HOT KEYWORD'}>
          <MainHotKeyword
            hotKeyword={main.hotKeyword}
            searchitem={searchitem}
          />
        </HomeItemDefault>

        {/* 앱 로그인 혜택 배너 */}
        <MainSideBanner list={searchHolder.mainImageSetFourList} />

        {/* Banners */}
        {eventpopup.popupList.length > 0
          ? eventpopup.popupList.map((data, index) => {
              return (
                <Fragment key={index}>
                  {data.popupStatus && (
                    <AppEventPopup isOpen={data.popupStatus} data={data} />
                  )}
                </Fragment>
              );
            })
          : null}

        {this.state.signupModal && (
          <PointSavingModal
            isOpen={this.state.signupModal}
            pointSavingType={pointSavingTypes.SIGNUP}
            savedPointResponse={this.state.savedPointResponse}
            onClose={() => {
              this.setState({ signupModal: false });
            }}
          />
        )}
      </div>
    );
  }
}

export default Home;

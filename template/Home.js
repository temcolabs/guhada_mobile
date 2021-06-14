import React from 'react';
import { toJS } from 'mobx';
import DefaultLayout from 'components/layout/DefaultLayout';
import { withRouter } from 'next/router';
import css from './Home.module.scss';
import MainSectionItem from 'components/home/MainSectionItem';
import { inject, observer } from 'mobx-react';
import CategorySlider from 'components/common/CategorySlider';
import { mainCategory } from 'childs/lib/constant/category';
import MainSlideBanner from 'components/home/MainSlideBanner';
import HomeItemDefault from 'components/home/HomeItemDefault';
import MainHotKeyword from 'components/home/MainHotKeyword';
import MainSideBanner from 'components/home/MainSideBanner';
import Router from 'next/router';
// import SignupSuccessModal from './signin/SignupSuccessModal';
import Footer from 'components/footer/Footer';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { pushRoute } from 'childs/lib/router';
import _ from 'lodash';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import isTruthy from 'childs/lib/common/isTruthy';
import AppEventPopup from 'components/event/popup/AppEventPopup';
import DeepLinkPopup from 'components/event/popup/DeepLinkPopup';
import PointSavingModal, {
  pointSavingTypes,
} from 'components/mypage/point/PointSavingModal';
import sessionStorage from 'childs/lib/common/sessionStorage';
import BestReview from 'components/home/BestReview';

@withScrollToTopOnMount
@withRouter
@inject('main', 'searchitem', 'eventpopup', 'searchHolder')
@observer
class Home extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      isDeepLinkModal: true,
      signupModal: false,
      email: '',
      scrollDirection: 'up',
      lastScrollTop: 0,
      savedPointResponse: {},
    };
  }

  componentDidMount() {
    let query = Router.router.query;

    const { main } = this.props;

    let asPath = Router.router.asPath;
    const category = mainCategory.item.find((item) => {
      return item.href === asPath;
    });

    if (_.isNil(category) === false) {
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

    // // 회원가입 성공 모달 표시
    // if (query.signupsuccess) {
    //   this.setState({
    //     signupModal: true,
    //     email: query.email,
    //   });

    //   // 회원가입 전환. 로그인한 상태가 아니어서 유저 아이디를 전달할 수 없다.
    //   widerplanetTracker.signUp({});
    // }
    window.addEventListener('scroll', this.scrollDirection);
    // let cookie = Cookies.get(key.ACCESS_TOKEN);

    this.props.eventpopup.appEventPopupOpen();

    main.getPlusItem();
    main.getNewArrivals();
    main.getHits();
    main.getBestReview();
    main.getHotKeyword();
    main.getMainBannner();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollDirection);
  }

  scrollDirection = _.debounce((e) => {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.state.lastScrollTop) {
      this.setState({ scrollDirection: 'down' });
    } else {
      this.setState({ scrollDirection: 'up' });
    }
    this.setState({ lastScrollTop: st <= 0 ? 0 : st });
  }, 10);

  // handleModal = (value) => {
  //   this.setState({
  //     signupModal: value,
  //   });

  // };

  render() {
    const { main, searchitem, eventpopup, searchHolder } = this.props;

    return (
      <DefaultLayout
        title={null}
        topLayout={'main'}
        history={true}
        scrollDirection={this.state.scrollDirection}
      >
        {/* TODO :: 카테고리 네비게이터 */}
        <CategorySlider
          categoryList={mainCategory.item}
          setNavDealId={main.setNavDealId}
          scrollDirection={this.state.scrollDirection}
        />

        {main.navDealId === 0 && !!isTruthy(main.bannerInfo) && (
          <MainSlideBanner imageFile={main.bannerInfo} />
        )}

        {/* <SignupSuccessModal
          isOpen={this.state.signupModal}
          isHandleModal={this.handleModal}
          email={this.state.email}
        /> */}

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
        <div>
          {/* Focus on items */}
          {main.navDealId === 0 && (
            <MainSideBanner
              title={'FOCUS ON'}
              type={'FOCUS_ON'}
              list={searchHolder.mainImageSetOneSetList}
            />
          )}

          {/* Premium Item */}
          <MainSectionItem
            title={'PREMIUM ITEM'}
            items={main.plusItem}
            categoryId={main.navDealId}
            toSearch={searchitem.toSearch}
            condition={'PLUS'}
          />

          {/* 상품 홍보 Large */}
          {main.navDealId === 0 && (
            <MainSideBanner list={searchHolder.mainImageSetTwoSetList} />
          )}

          {/* Hok keyword > main */}
          {main.navDealId === 0 && (
            <HomeItemDefault header={'HOT KEYWORD'}>
              <MainHotKeyword
                hotKeyword={main.hotKeyword}
                searchitem={searchitem}
              />
            </HomeItemDefault>
          )}

          <MainSectionItem
            title={'BEST ITEM'}
            items={main.hits}
            categoryId={main.navDealId}
            toSearch={searchitem.toSearch}
            condition={'BEST'}
          />

          {main.navDealId === 0 && (
            <HomeItemDefault header={'BEST REVIEW'}>
              <BestReview />
            </HomeItemDefault>
          )}

          {/* 상품 홍보 Small */}
          {main.navDealId === 0 && (
            <MainSideBanner list={searchHolder.mainImageSetThreeList} />
          )}

          <MainSectionItem
            title={'NEW IN'}
            items={main.newArrivals}
            categoryId={main.navDealId}
            toSearch={searchitem.toSearch}
            condition={'NEW'}
          />

          {/* Hok keyword > main */}
          {main.navDealId !== 0 && (
            <HomeItemDefault header={'HOT KEYWORD'}>
              <MainHotKeyword
                hotKeyword={main.hotKeyword}
                searchitem={searchitem}
              />
            </HomeItemDefault>
          )}
        </div>

        {/* 앱 로그인 혜택 배너 */}
        {main.navDealId === 0 && (
          <MainSideBanner list={searchHolder.mainImageSetFourList} />
        )}

        {eventpopup.popupList.length > 0
          ? eventpopup.popupList.map((data, index) => {
              return (
                <React.Fragment key={index}>
                  {data.popupStatus && (
                    <AppEventPopup isOpen={data.popupStatus} data={data} />
                  )}
                </React.Fragment>
              );
            })
          : null}

        {this.state.isDeepLinkModal && (
          <DeepLinkPopup
            isOpen={this.state.isDeepLinkModal}
            onClose={() =>
              this.setState({ ...this.state, isDeepLinkModal: false })
            }
          />
        )}

        <Footer />
      </DefaultLayout>
    );
  }
}

export default Home;

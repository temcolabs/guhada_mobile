import React from 'react';
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
import Router from 'next/router';
// import SignupSuccessModal from './signin/SignupSuccessModal';
import Footer from 'components/footer/Footer';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { pushRoute } from 'childs/lib/router';
import _ from 'lodash';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import isTruthy from 'childs/lib/common/isTruthy';
import AppEventPopup from 'components/event/popup/AppEventPopup';
import PointSavingModal, {
  pointSavingTypes,
} from 'components/mypage/point/PointSavingModal';
import sessionStorage from 'childs/lib/common/sessionStorage';
import BestReview from 'components/home/BestReview';

@withScrollToTopOnMount
@withRouter
@inject('main', 'searchitem', 'eventpopup')
@observer
class Home extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
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
    main.getHotKeyword();
    main.getMainBannner();
    main.getBestReview();
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
    const { main, searchitem, eventpopup } = this.props;

    return (
      <DefaultLayout
        title={null}
        topLayout={'main'}
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

        <PointSavingModal
          isOpen={this.state.signupModal}
          pointSavingType={pointSavingTypes.SIGNUP}
          savedPointResponse={this.state.savedPointResponse}
          onClose={() => {
            this.setState({ signupModal: false });
          }}
        />
        <div>
          <MainSectionItem
            title={'PREMIUM ITEM'}
            items={main.plusItem}
            categoryId={main.navDealId}
            toSearch={searchitem.toSearch}
            condition={'PLUS'}
          />

          <HomeItemDefault header={'BEST REVIEW'}>
            <BestReview />
          </HomeItemDefault>

          <MainSectionItem
            title={'BEST ITEM'}
            items={main.hits}
            categoryId={main.navDealId}
            toSearch={searchitem.toSearch}
            condition={'BEST'}
          />
          <MainSectionItem
            title={'NEW IN'}
            items={main.newArrivals}
            categoryId={main.navDealId}
            toSearch={searchitem.toSearch}
            condition={'NEW'}
          />
        </div>
        <HomeItemDefault header={'HOT KEYWORD'}>
          <MainHotKeyword
            hotKeyword={main.hotKeyword}
            searchitem={searchitem}
          />
        </HomeItemDefault>

        {eventpopup.popupList.length > 0
          ? eventpopup.popupList.map((data, index) => {
              return (
                <AppEventPopup
                  isOpen={data.popupStatus}
                  data={data}
                  key={index}
                />
              );
            })
          : null}

        <Footer />
      </DefaultLayout>
    );
  }
}

export default Home;

import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { withRouter } from 'next/router';
import css from './Home.module.scss';
import MainSectionItem from 'components/home/MainSectionItem';
import { inject, observer } from 'mobx-react';
import CategorySlider from 'components/common/CategorySlider';
import { mainCategory } from 'constant/category';
import MainSlideBanner from 'components/home/MainSlideBanner';
import HomeItemDefault from 'components/home/HomeItemDefault';
import MainHotKeyword from 'components/home/MainHotKeyword';
import Router from 'next/router';
import SignupSuccessModal from './signin/SignupSuccessModal';
import Footer from 'components/footer/Footer';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import { pushRoute } from 'lib/router';
import _ from 'lodash';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';

@withScrollToTopOnMount
@withRouter
@inject('main', 'searchitem')
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
    };
  }

  componentDidMount() {
    let query = Router.router.query;
    const { main } = this.props;

    let asPath = Router.router.asPath;
    const category = mainCategory.item.find(item => {
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

    // 회원가입 성공 모달 표시
    if (query.signupsuccess) {
      this.setState({
        signupModal: true,
        email: query.email,
      });

      // 회원가입 전환. 로그인한 상태가 아니어서 유저 아이디를 전달할 수 없다.
      widerplanetTracker.signUp({});
    }
    window.addEventListener('scroll', this.scrollDirection);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollDirection);
  }

  scrollDirection = _.debounce(e => {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > this.state.lastScrollTop) {
      this.setState({ scrollDirection: 'down' });
    } else {
      this.setState({ scrollDirection: 'up' });
    }
    this.setState({ lastScrollTop: st <= 0 ? 0 : st });
  }, 10);

  handleModal = value => {
    this.setState({
      signupModal: value,
    });
  };

  render() {
    const { main, searchitem } = this.props;

    const slideImages = [
      {
        src: `${
          process.env.API_CLOUD
        }/images/banner/luckydraw/lucky_main_m_360.png`,
        href: `/event/luckydraw`,
      },
      {
        src: `${
          process.env.API_CLOUD
        }/images/banner/timedeal/timedeal_main_m_360.png`,
        href: `/event/timedeal`,
      },
      {
        src: `${
          process.env.API_CLOUD
        }/images/banner/signup5000/join_main_m_360.png`,
        href: `/`,
      },
      {
        src: `${
          process.env.API_CLOUD
        }/images/banner/2perdiscount/2per_main_m_360.png`,
        href: `/`,
      },
      {
        src: `${
          process.env.API_CLOUD
        }/images/banner/genuine/genuine_main_m_360.png`,
        href: `/`,
      },
    ];
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
        {/* TODO :: 임시로 만들어놓은 슬라이드 배너
        현재 dot 구현은 되어 있지 않음 */}

        {main.navDealId === 0 && <MainSlideBanner imageFile={slideImages} />}

        <SignupSuccessModal
          isOpen={this.state.signupModal}
          isHandleModal={this.handleModal}
          email={this.state.email}
        />
        <div>
          <MainSectionItem
            title={'PREMIUM ITEM'}
            items={main.plusItem}
            categoryId={main.navDealId}
            toSearch={searchitem.toSearch}
            condition={'PLUS'}
          />
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
        <Footer />
      </DefaultLayout>
    );
  }
}

export default Home;

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
    if (query.signupsuccess) {
      this.setState({
        signupModal: true,
        email: query.email,
      });
    }
  }

  handleModal = value => {
    this.setState({
      signupModal: value,
    });
  };

  render() {
    const { main, searchitem } = this.props;
    const imageFile = [
      `${process.env.API_CLOUD}/images/home/dummy_mobile/00_main_0.png`,
      `${process.env.API_CLOUD}/images/home/dummy_mobile/00_main_1.png`,
      `${process.env.API_CLOUD}/images/home/dummy_mobile/00_main_2.png`,
      `${process.env.API_CLOUD}/images/home/dummy_mobile/00_main_3.png`,
      `${process.env.API_CLOUD}/images/home/dummy_mobile/00_main_4.png`,
    ];
    return (
      <DefaultLayout title={null} topLayout={'main'}>
        {/* TODO :: 카테고리 네비게이터 */}
        <CategorySlider
          categoryList={mainCategory.item}
          setNavDealId={main.setNavDealId}
        />
        {/* TODO :: 임시로 만들어놓은 슬라이드 배너
        현재 dot 구현은 되어 있지 않음 */}
        {/* <MainSlideBanner imageFile={imageFile} /> */}
        {main.navDealId === 0 && (
          <img
            className={css.mainPromotionImage}
            src="/static/main_banner.png"
            alt="main"
          />
        )}

        <SignupSuccessModal
          isOpen={this.state.signupModal}
          isHandleModal={this.handleModal}
          email={this.state.email}
        />
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

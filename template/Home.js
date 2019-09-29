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

@withRouter
@inject('main', 'searchitem')
@observer
class Home extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

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
        <img
          className={css.mainPromotionImage}
          src="/static/main_banner.png"
          alt="main"
        />
        <MainSectionItem
          title={'PREMIUM ITEM'}
          items={main.plusItem}
          categoryId={main.navDealId}
        />
        <MainSectionItem
          title={'BEST ITEM'}
          items={main.hits}
          categoryId={main.navDealId}
        />
        <MainSectionItem
          title={'NEW ARRIVALS'}
          items={main.newArrivals}
          categoryId={main.navDealId}
        />
        <HomeItemDefault header={'HOT KEYWORD'}>
          <MainHotKeyword
            hotKeyword={main.hotKeyword}
            searchitem={searchitem}
          />
        </HomeItemDefault>
      </DefaultLayout>
    );
  }
}

export default Home;

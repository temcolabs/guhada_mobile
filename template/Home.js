import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { withRouter } from 'next/router';
import css from './Home.module.scss';
import MainSectionItem from 'components/home/MainSectionItem';
import { inject, observer } from 'mobx-react';
import CategorySlider from 'components/common/CategorySlider';
import { mainCategory } from 'constant/category';

@withRouter
@inject('main')
@observer
class Home extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { main } = this.props;

    return (
      <DefaultLayout title={null} topLayout={'main'}>
        {/* todo :: 카테고리 네비게이터 */}
        <CategorySlider category={mainCategory.item} />
        <div className={css.mainImage}>
          <img src={'/static/01_visual.png'} alt="" />
        </div>
        <MainSectionItem title={'PLUS ITEM'} items={main.plusItem} />
        <MainSectionItem title={'NEW ARRIVALS'} items={main.newArrivals} />
        <MainSectionItem title={'BEST ITEM'} items={main.hits} />
      </DefaultLayout>
    );
  }
}

export default Home;

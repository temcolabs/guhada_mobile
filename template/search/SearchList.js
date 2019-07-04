import React, { Component } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import SearchItem from 'components/search/SearchItem';
import css from './SearchList.module.scss';
import SearchItemHeader from 'components/search/SearchItemHeader';
import CategorySlider from 'components/common/CategorySlider';

@inject('searchitem')
@observer
class SearchList extends Component {
  componentDidMount() {
    const { searchitem } = this.props;
    window.addEventListener('scroll', searchitem.listenToScroll);
  }

  componentWillUnmount() {
    const { searchitem } = this.props;
    window.removeEventListener('scroll', searchitem.listenToScroll);
  }

  render() {
    const { searchitem } = this.props;
    console.log('toJS(searchitem.', toJS(searchitem.item));

    return (
      <DefaultLayout>
        <CategorySlider category={searchitem.headerCategory} />
        <SearchItemHeader />
        <div className={css.searchItemWrap}>
          <SearchItem deals={searchitem.deals} />
        </div>
      </DefaultLayout>
    );
  }
}

export default SearchList;

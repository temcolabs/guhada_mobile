import React, { Component } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import SearchItem4 from 'components/search/SearchItem4';
import css from './SearchList.module.scss';
import SearchItemHeader from 'components/search/SearchItemHeader';
import CategorySlider from 'components/common/CategorySlider';
import SearchItem2 from 'components/search/SearchItem2';
import SearchItem6 from 'components/search/SearchItem6';
import Router from 'next/router';

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

    return (
      <DefaultLayout>
        {Router.router.query.enter === 'brand' ? null : (
          <CategorySlider category={searchitem.headerCategory} />
        )}
        <SearchItemHeader />
        <div className={css.searchItemWrap}>
          {searchitem.thumbnail === 'list4' ? (
            <SearchItem4 deals={searchitem.deals} />
          ) : searchitem.thumbnail === 'list2' ? (
            <SearchItem2 deals={searchitem.deals} />
          ) : (
            <SearchItem6 deals={searchitem.deals} />
          )}
        </div>
      </DefaultLayout>
    );
  }
}

export default SearchList;

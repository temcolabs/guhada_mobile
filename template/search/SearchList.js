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
import SearchOrder from 'components/search/SearchOrder';
import { withRouter } from 'next/router';

@withRouter
@inject('searchitem')
@observer
class SearchList extends Component {
  // componentDidUpdate(prevProps, prevState) {
  //   const { searchitem } = this.props;
  //   console.log('componentDidup');
  //   // TODO: query 데이터 사용
  //   let query = this.props.router.query;
  //   console.log('prevProps.router.query', prevProps.router.query);
  //   console.log('query', query);
  //   console.log('this', Router.router.query);

  //   if (prevProps.router.query !== query) {
  //     let brand = query.brand;
  //     let category = query.category;
  //     let page = query.page;
  //     let unitPerPage = query.unitPerPage;
  //     let filter = query.filter;
  //     let subcategory = query.subcategory;
  //     let order = query.order;
  //     let enter = query.enter;
  //     let keyword = query.keyword;

  //     brand = JSON.parse('[' + brand + ']');
  //     category = JSON.parse('[' + category + ']');
  //     subcategory = JSON.parse('[' + subcategory + ']');

  //     if (brand.length > 0 || category.length > 0) {
  //       console.log('1', 1);
  //       searchitem.getSearchByUri(
  //         brand,
  //         category[0],
  //         page,
  //         unitPerPage,
  //         order,
  //         filter,
  //         subcategory,
  //         enter,
  //         keyword
  //       );
  //     } else if (enter === 'brand' || enter === 'keyword') {
  //       console.log('2', 2);
  //       searchitem.getSearchByUri(
  //         brand,
  //         category[0] ? category[0] : '',
  //         page,
  //         unitPerPage,
  //         order,
  //         filter,
  //         subcategory,
  //         enter,
  //         keyword
  //       );
  //     }
  //   }
  // }

  state = {
    isOrderVisible: false,
  };

  setIsOrderVisible = visible => {
    this.setState({
      isOrderVisible: visible,
    });
  };

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
        <SearchItemHeader setIsOrderVisible={this.setIsOrderVisible} />
        <div className={css.searchItemWrap}>
          {searchitem.thumbnail === 'list4' ? (
            <SearchItem4 deals={searchitem.deals} />
          ) : searchitem.thumbnail === 'list2' ? (
            <SearchItem2 deals={searchitem.deals} />
          ) : (
            <SearchItem6 deals={searchitem.deals} />
          )}
        </div>
        <SearchOrder
          isVisible={this.state.isOrderVisible}
          onClose={() => this.setIsOrderVisible(false)}
          setSearchOrderFilter={searchitem.setSearchOrderFilter}
          searchOrderFilter={searchitem.searchOrderFilter}
          toSearch={searchitem.toSearch}
        />
      </DefaultLayout>
    );
  }
}

export default SearchList;

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import SearchList from 'template/search/SearchList';
import Router from 'next/router';
import LoadingPortal from 'components/common/loading/Loading';
import { withRouter } from 'next/router';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@withRouter
@inject('searchitem')
@observer
class search extends Component {
  componentDidMount() {
    const { searchitem } = this.props;
    const query = Router.router.query;

    if (
      searchitem.deals?.length === 0 ||
      Router.asPath !== toJS(searchitem.preUrl)
    ) {
      searchitem.deals = [];
      searchitem.preUrl = Router.asPath;
      searchitem.initDealspage();
      if (query.filtered === 'false') searchitem.initSearchFilterList();

      let brand = JSON.parse('[' + query.brand + ']');
      let subcategory = JSON.parse('[' + query.subcategory + ']');

      searchitem.getSearchByUri(
        brand,
        query.category,
        query.page,
        query.unitPerPage,
        query.order,
        query.filter,
        subcategory,
        query.enter,
        query.keyword,
        query.resultKeyword,
        query.condition,
        query.productCondition,
        query.shippingCondition,
        query.minPrice,
        query.maxPrice
      );
    } else {
      searchitem.preUrl = Router.asPath;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchitem } = this.props;
    const query = Router.router.query;

    if (prevProps.router.query !== query) {
      searchitem.deals = [];
      searchitem.preUrl = Router.asPath;
      searchitem.initDealspage();
      if (query.filtered === 'false') searchitem.initSearchFilterList();

      let brand = JSON.parse('[' + query.brand + ']');
      let subcategory = JSON.parse('[' + query.subcategory + ']');

      searchitem.getSearchByUri(
        brand,
        query.category,
        query.page,
        query.unitPerPage,
        query.order,
        query.filter,
        subcategory,
        query.enter,
        query.keyword,
        query.resultKeyword,
        query.condition,
        query.productCondition,
        query.shippingCondition,
        query.minPrice,
        query.maxPrice
      );
    }
  }
  render() {
    const { searchitem } = this.props;

    return (
      <>
        <HeadForSEO pageName="검색 결과" />

        <div>{searchitem.itemStatus ? <SearchList /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default search;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import SearchList from 'template/search/SearchList';
import Router from 'next/router';
import LoadingPortal from 'components/common/loading/Loading';
import { withRouter } from 'next/router';

@withRouter
@inject('searchitem')
@observer
class search extends Component {
  componentDidMount() {
    const { searchitem } = this.props;
    const query = Router.router.query;

    searchitem.deals = [];
    searchitem.preUrl = Router.asPath;
    searchitem.initDealspage();

    let brand = JSON.parse('[' + query.brand + ']');
    // let category = JSON.parse('[' + query.category + ']');
    let subcategory = JSON.parse('[' + query.subcategory + ']');

    if (query.enter === 'keyword') {
      searchitem.getSearchByUri(
        '',
        '',
        1,
        searchitem.unitPerPage,
        '',
        '',
        '',
        'keyword',
        query.keyword
      );
    } else if (query.brand || query.category) {
      searchitem.getSearchByUri(
        brand,
        query.category,
        query.page,
        query.unitPerPage,
        query.order,
        query.filter,
        subcategory,
        query.enter,
        query.keyword
      );
    }
  }

  render() {
    const { searchitem } = this.props;

    return (
      <>
        <Head>
          <title>검색 결과</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <div>{searchitem.itemStatus ? <SearchList /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default search;

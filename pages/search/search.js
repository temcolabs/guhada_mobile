import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Head from 'next/head';
import SearchList from 'template/search/SearchList';
import Router from 'next/router';
import LoadingPortal from 'components/common/loading/Loading';

@inject('searchitem')
@observer
class search extends Component {
  componentDidMount() {
    const { searchitem } = this.props;
    const query = Router.router.query;
    // console.log('query', query);
    searchitem.initDealspage();

    let brand = JSON.parse('[' + query.brand + ']');
    // let category = JSON.parse('[' + query.category + ']');
    let subcategory = JSON.parse('[' + query.subcategory + ']');

    if (query.brand || query.category) {
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
        </Head>
        <div>{searchitem.itemStatus ? <SearchList /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default search;

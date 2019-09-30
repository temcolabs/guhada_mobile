import React, { Component } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { inject, observer } from 'mobx-react';
import css from './SearchList.module.scss';
import Router from 'next/router';
import { withRouter } from 'next/router';
import {
  SearchItemHeader,
  SearchItem2,
  SearchItem4,
  SearchItem6,
  SearchOrder,
  SearchCategorySlider,
} from 'components/search';
// import { SearchFilter } from 'components/search/SearchFilter';

// enter : keyword 일때
import KeywordMenu from 'components/header/keyword/KeywordMenu';

@withRouter
@inject('searchitem')
@observer
class SearchList extends Component {
  state = {
    isOrderVisible: false,
    isFilterVisible: false,
    isSearchVisible: false,
  };

  setIsOrderVisible = visible => {
    this.setState({
      isOrderVisible: visible,
    });
  };

  setIsFilterVisible = visible => {
    this.setState({
      isFilterVisible: visible,
    });
  };

  setIsSearchVisible = visible => {
    this.setState({ isSearchVisible: visible });
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
    const { searchitem, keyword } = this.props;
    let isBrand = Router.router.query.enter === 'brand';
    let isKeyword;

    if (Router.router.query.enter === 'keyword') {
      isKeyword = true;
    } else if (keyword === 'keyword') {
      isKeyword = true;
    }

    return (
      <DefaultLayout
        topLayout={isBrand ? 'category' : isKeyword ? 'keyword' : 'search'}
        pageTitle={searchitem.title}
        headerShape={isKeyword ? 'keyword' : 'searchList'}
      >
        {/* enter가 keyword 인 경우에만 불러오는 메뉴 component */}
        {isKeyword ? (
          <KeywordMenu
            keywordText={Router.router.query.keyword}
            setIsSearchVisible={this.setIsSearchVisible}
          />
        ) : null}

        {isBrand || isKeyword ? null : (
          <SearchCategorySlider
            category={searchitem.headerCategory}
            router={this.props.router}
          />
        )}

        <>
          <SearchItemHeader
            setIsOrderVisible={this.setIsOrderVisible}
            setIsFilterVisible={this.setIsFilterVisible}
            isBrand={isBrand || isKeyword ? true : false}
            scrollDirection={searchitem.scrollDirection}
          />
          <div className={css.searchItemWrap}>
            {searchitem.thumbnail === 'list4' ? (
              <SearchItem4 deals={searchitem.deals} />
            ) : searchitem.thumbnail === 'list2' ? (
              <SearchItem2 deals={searchitem.deals} />
            ) : (
              <SearchItem6 deals={searchitem.deals} />
            )}
          </div>
        </>

        <SearchOrder
          isVisible={this.state.isOrderVisible}
          onClose={() => this.setIsOrderVisible(false)}
          setSearchOrderFilter={searchitem.setSearchOrderFilter}
          searchOrderFilter={searchitem.searchOrderFilter}
          toSearch={searchitem.toSearch}
        />

        {/* NEXT TODO */}
        {/* <SearchFilter
          isVisible={this.state.isFilterVisible}
          onClose={() => this.setIsFilterVisible(false)}
          filters={searchitem.filterData}
        /> */}
      </DefaultLayout>
    );
  }
}

export default SearchList;

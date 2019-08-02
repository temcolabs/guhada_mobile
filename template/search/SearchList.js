import React, { Component } from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import SearchItem4 from 'components/search/SearchItem4';
import css from './SearchList.module.scss';
import SearchItemHeader from 'components/search/SearchItemHeader';
import SearchItem2 from 'components/search/SearchItem2';
import SearchItem6 from 'components/search/SearchItem6';
import Router from 'next/router';
import SearchOrder from 'components/search/SearchOrder';
import { withRouter } from 'next/router';
import SearchCategorySlider from 'components/search/SearchCategorySlider';
import { SearchFilter } from 'components/search/SearchFilter';

@withRouter
@inject('searchitem')
@observer
class SearchList extends Component {
  state = {
    isOrderVisible: false,
    isFilterVisible: false,
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
    let isBrand = Router.router.query.enter === 'brand';

    return (
      <DefaultLayout
        topLayout={isBrand ? 'category' : 'search'}
        pageTitle={searchitem.title}
        headerShape={'searchList'}
      >
        {isBrand ? null : (
          <SearchCategorySlider
            category={searchitem.headerCategory}
            router={this.props.router}
          />
        )}
        <SearchItemHeader
          setIsOrderVisible={this.setIsOrderVisible}
          setIsFilterVisible={this.setIsFilterVisible}
          isBrand={isBrand ? true : false}
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
        <SearchOrder
          isVisible={this.state.isOrderVisible}
          onClose={() => this.setIsOrderVisible(false)}
          setSearchOrderFilter={searchitem.setSearchOrderFilter}
          searchOrderFilter={searchitem.searchOrderFilter}
          toSearch={searchitem.toSearch}
        />

        <SearchFilter
          isVisible={this.state.isFilterVisible}
          onClose={() => this.setIsFilterVisible(false)}
          filters={searchitem.filterData}
        />
      </DefaultLayout>
    );
  }
}

export default SearchList;

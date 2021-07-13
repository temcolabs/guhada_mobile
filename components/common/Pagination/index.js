import { Component } from 'react';
import ReactJsPagination from 'react-js-pagination';
import css from './Pagination.module.scss';
import { number, func, object } from 'prop-types';
import { devLog } from 'lib/common/devLog';

/**
 * 페이지는 1부터 시작한다. (0으로 시작하는 API 사용할 때 주의)
 */
export default class Pagination extends Component {
  static propTypes = {
    onChangePage: func.isRequired,
    initialPage: number,
    itemsCountPerPage: number,
    totalItemsCount: number.isRequired,
    wrapperStyle: object,
  };

  static defaultProps = {
    wrapperStyle: {},
    pageRangeDisplayed: 10,
  };

  handlePageChange = (pageNumber) => {
    devLog(`active page is ${pageNumber}`);
    this.props.onChangePage(pageNumber);
  };

  render() {
    const {
      itemsCountPerPage,
      totalItemsCount,
      pageRangeDisplayed,
      wrapperStyle,
      initialPage,
    } = this.props;

    return (
      <div style={wrapperStyle}>
        <ReactJsPagination
          activePage={initialPage}
          itemsCountPerPage={itemsCountPerPage}
          totalItemsCount={Math.max(itemsCountPerPage, totalItemsCount)} // 최소 1페이지는 보이게
          pageRangeDisplayed={pageRangeDisplayed}
          onChange={this.handlePageChange}
          innerClass={css.wrap}
          itemClass={css.item}
          activeClass={`${css.isSelected}`}
          itemClassFirst={`${css.toFirst}`}
          itemClassPrev={`${css.toPrev}`}
          itemClassNext={`${css.toNext}`}
          itemClassLast={`${css.toLast}`}
          linkClassFirst={css.anchor__toFirst}
          prevPageText={''}
          firstPageText={''}
          lastPageText={''}
          nextPageText={''}
        />
      </div>
    );
  }
}

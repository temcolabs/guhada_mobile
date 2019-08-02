import React, { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './SearchFilter.module.scss';
import cn from 'classnames';
import Router from 'next/router';
import RgbButton from './RgbButton';
import TextButton from './TextButton';

export class SearchFilter extends Component {
  render() {
    const {
      isVisible,
      onClose,
      filters,
      setSearchOrderFilter,
      searchOrderFilter,
      toSearch,
    } = this.props;

    const { query } = Router.router;
    console.log('filters', filters);
    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>상세검색</div>
          <div className={css.itemWrap}>
            <div className={cn(css.item)}>카테고리</div>
            <div className={cn(css.item)}>브랜드</div>
            {filters
              ? filters.map(filter => {
                  if (filter.viewType === 'RGB_BUTTON') {
                    return <RgbButton filter={filter} />;
                  } else {
                    return <TextButton filter={filter} />;
                  }
                })
              : null}
          </div>
        </div>
      </SlideIn>
    );
  }
}

export default SlideIn;

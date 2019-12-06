import React, { useState } from 'react';
import css from './SearchCategory.module.scss';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import isTruthy from 'childs/lib/common/isTruthy';
import { getCategory, searchChildrenCheck } from 'utils';
import { toJS } from 'mobx';
import FilterBrand from './FilterBrand';
const enhancer = compose(withRouter);

const SearchBrand = enhancer(({ searchitem, router }) => {
  const [isOpen, setisOpen] = useState(false);

  return useObserver(() => (
    <div className={css.wrap}>
      <div
        className={cn(css.headerWrap, { [css.open]: isOpen === true })}
        onClick={() => {
          setisOpen(!isOpen);
        }}
      >
        브랜드
        <div className={css.spanWrap}>
          {searchitem.filterBrand.map((brand, index) => {
            return <span key={index}>{brand.nameDefault}</span>;
          })}
        </div>
      </div>
      {isOpen && <FilterBrand />}
    </div>
  ));
});
export default inject('searchitem')(SearchBrand);

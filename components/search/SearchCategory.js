import React, { useState, useMemo } from 'react';
import css from './SearchCategory.module.scss';
import './SearchCategory.scss';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react-lite';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import isTruthy from 'childs/lib/common/isTruthy';
import { getCategory, searchChildrenCheck } from 'utils';
import { toJS } from 'mobx';
import Tree from 'rc-tree';
const enhancer = compose(withRouter);

const SearchCategory = enhancer(({ searchitem, router }) => {
  const [isOpen, setisOpen] = useState(false);
  const entireCategories = searchChildrenCheck(
    toJS(searchitem.item?.categories)
  );

  let categoryId = isTruthy(router.query.subcategory)
    ? router.query.subcategory
    : router.query.category;

  const categories = isTruthy(searchitem.selectCategory)
    ? getCategory(entireCategories, categoryId)
    : searchitem.selectCategory;

  return useObserver(() => (
    <div className={css.wrap}>
      <div
        className={cn(css.headerWrap, { [css.open]: isOpen === true })}
        onClick={() => {
          setisOpen(!isOpen);
        }}
      >
        카테고리
        <span>{categories?.fullDepthName}</span>
      </div>
      {isOpen && (
        <div className={css.categoryWrap}>
          <Tree
            checkable
            expandedKeys={searchitem.getExpandedKeys}
            onSelect={searchitem.onSelect}
            onCheck={searchitem.onCheck}
            checkedKeys={searchitem.getCheckedKeys}
            treeData={entireCategories}
            autoExpandParent={true}
          />
        </div>
      )}
    </div>
  ));
});
export default inject('searchitem')(SearchCategory);

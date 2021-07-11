import React, { useState, useEffect } from 'react';
import css from './SearchCategory.module.scss';
import './SearchCategory.scss';
import cn from 'classnames';
import { inject } from 'mobx-react';
import { useObserver } from 'mobx-react';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import isTruthy from 'childs/lib/common/isTruthy';
import { getCategory, searchChildrenCheck } from 'utils';
import { toJS } from 'mobx';
import Tree, { TreeNode } from 'rc-tree';

const enhancer = compose(withRouter);

const SearchCategory = enhancer(({ itemStore, router }) => {
  const selectCategory = itemStore?.selectCategory;
  const entireCategories = searchChildrenCheck(
    toJS(itemStore.item?.categories)
  );

  const [isOpen, setisOpen] = useState(false);
  const [categoryId] = useState(router.query.category);
  const [categories] = useState(getCategory(entireCategories, categoryId));

  useEffect(() => {
    if (!isTruthy(categoryId)) {
      itemStore.setExpandedKeys(null);
    }
  }, [categoryId, itemStore, categories]);

  const loop = (data) => {
    return data.map((item) => {
      if (item.children) {
        return <TreeNode {...item}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode {...item} />;
    });
  };

  return useObserver(() => (
    <div className={css.wrap}>
      <div
        className={cn(css.headerWrap, { [css.open]: isOpen === true })}
        onClick={() => {
          setisOpen(!isOpen);
        }}
      >
        카테고리
        <span>{selectCategory?.fullDepthName}</span>
      </div>
      {isOpen && (
        <div className={css.categoryWrap}>
          <Tree
            checkable
            expandedKeys={itemStore.getExpandedKeys}
            onSelect={itemStore.onSelect}
            onCheck={itemStore.onCheck}
            checkedKeys={itemStore.getCheckedKeys}
            autoExpandParent={true}
          >
            {loop(entireCategories)}
          </Tree>
        </div>
      )}
    </div>
  ));
});
export default SearchCategory;

import React, { useState, useEffect } from 'react';
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
import Tree, { TreeNode } from 'rc-tree';

const enhancer = compose(withRouter);

const SearchCategory = enhancer(({ searchitem, router }) => {
  const [isOpen, setisOpen] = useState(false);
  const entireCategories = searchChildrenCheck(
    toJS(searchitem.item?.categories)
  );
  const [categoryId] = useState(router.query.category);
  const [categories] = useState(getCategory(entireCategories, categoryId));

  useEffect(() => {
    if (!isTruthy(categoryId)) {
      searchitem.setExpandedKeys(null);
    }
  }, [categoryId, searchitem, categories]);

  const loop = data => {
    return data.map(item => {
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
            autoExpandParent={true}
          >
            {loop(entireCategories)}
          </Tree>
        </div>
      )}
    </div>
  ));
});
export default inject('searchitem')(SearchCategory);

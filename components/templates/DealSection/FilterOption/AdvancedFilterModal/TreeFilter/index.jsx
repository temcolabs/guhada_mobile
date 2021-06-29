import css from './TreeFilter.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import cn from 'classnames';
import TreeNode from './TreeNode';

const TraversibleNode = ({
  children,
  currentIds,
  handleSetIds,
  handleRemoveIds,
}) => {
  const handleToggleIsChecked = (id, hierarchy, isChecked, childrenIds) => {
    const parentIds = hierarchy.split(',').map(Number);
    if (isChecked) {
      if (childrenIds) {
        handleRemoveIds([id, ...parentIds, ...childrenIds]);
      } else {
        handleRemoveIds([id, ...parentIds]);
      }
      // if (childrenIds) {
      //   handleRemoveIds([id, ...parentIds, ...childrenIds]);
      // } else {
      //   handleRemoveIds([id, ...parentIds]);
      // }
    } else {
      if (childrenIds) {
        handleRemoveIds([...parentIds, ...childrenIds]);
      } else {
        handleRemoveIds([...parentIds]);
      }
      handleSetIds([id]);
      // if (childrenIds) {
      //   handleSetIds([id, ...childrenIds]);
      // } else {
      //   handleSetIds([id]);
      // }
    }
  };

  const sortChildren = (children) =>
    toJS(children).sort((a, b) => {
      if (a.title === '기타') {
        return 1;
      } else if (b.title === '기타') {
        return -1;
      } else if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

  return (
    <>
      {sortChildren(children).map((child) => {
        const {
          children,
          id,
          // fullDepthName,
          // hierarchies,
          hierarchy,
          // title,
        } = child;
        const isChecked = currentIds.includes(id);
        // const isChecked =
        //   currentIds.includes(parentId) || currentIds.includes(id);

        if (!!children) {
          const sortedChildren = sortChildren(children);
          const childrenIds = sortedChildren.map(({ id }) => id);

          return (
            <TreeNode
              key={id}
              isChecked={isChecked}
              handleToggleIsChecked={() =>
                handleToggleIsChecked(id, hierarchy, isChecked, childrenIds)
              }
              {...child}
            >
              <TraversibleNode
                children={sortedChildren}
                currentIds={currentIds}
                handleSetIds={handleSetIds}
                handleRemoveIds={handleRemoveIds}
                {...child}
              />
            </TreeNode>
          );
        }

        return (
          <TreeNode
            key={id}
            isChecked={isChecked}
            handleToggleIsChecked={() =>
              handleToggleIsChecked(id, hierarchy, isChecked)
            }
            {...child}
          />
        );
      })}
    </>
  );
};

TraversibleNode.propTypes = {
  children: PropTypes.any,
  id: PropTypes.number,
  currentIds: PropTypes.any,
  handleSetIds: PropTypes.func,
  handleRemoveIds: PropTypes.func,
};

const TreeFilter = ({ title, dataList, currentIds, setIds }) => {
  /**
   * states
   */
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /**
   * handlers
   */
  const handleSetIds = (ids) => {
    const nextIdsSet = new Set([...currentIds, ...ids]);
    const nextIds = Array.from(nextIdsSet);
    setIds(nextIds);
  };
  const handleRemoveIds = (ids) => {
    const idsSet = new Set(ids);
    const nextIds = currentIds.filter((value) => !idsSet.has(value));
    setIds(nextIds);
  };

  /**
   * render
   */
  return (
    <div className={css['tree']}>
      <div
        className={cn(css['tree__title'], isFilterOpen && css['open'])}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        {title}
        {/* <span className={css['tree__title__depth']} /> */}
      </div>
      {isFilterOpen && (
        <TraversibleNode
          children={dataList}
          currentIds={currentIds}
          handleSetIds={handleSetIds}
          handleRemoveIds={handleRemoveIds}
        />
      )}
    </div>
  );
};

TreeFilter.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.any,
  currentIds: PropTypes.any,
  setIds: PropTypes.func,
};

export default observer(TreeFilter);

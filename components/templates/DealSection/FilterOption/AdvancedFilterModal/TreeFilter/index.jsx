import css from './TreeFilter.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import cn from 'classnames';
import TreeNode from './TreeNode';

const TraversibleNode = ({
  children,
  id: parentId,
  currentIds,
  handleSetIds,
  handleRemoveIds,
}) => {
  const handleToggleIsChecked = (id, hierarchy, isChecked, childrenIds) => {
    if (isChecked) {
      const parentIds = hierarchy.split(',').map(Number);
      if (childrenIds) {
        handleRemoveIds([id, ...parentIds, ...childrenIds]);
      } else {
        handleRemoveIds([id, ...parentIds]);
      }
    } else {
      if (childrenIds) {
        handleSetIds([id, ...childrenIds]);
      } else {
        handleSetIds([id]);
      }
    }
  };

  return (
    <>
      {children.map((child) => {
        const {
          children,
          id,
          // fullDepthName,
          // hierarchies,
          hierarchy,
          // title,
        } = child;
        const isChecked =
          currentIds.includes(parentId) || currentIds.includes(id);

        if (!!children) {
          const childrenIds = child.children.map(({ id }) => id);

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
                children={children}
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

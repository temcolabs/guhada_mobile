import css from './TreeFilter.module.scss';
import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import TreeNode from './TreeNode';

const TraversibleNode = ({ children, handleSetId, handleRemoveId }) => {
  return children.map((child) => {
    const {
      children,
      // fullDepthName,
      // hierarchies,
      // hierarchy,
      id,
      // title,
    } = child;

    if (!!children) {
      return (
        <TreeNode
          key={id}
          handleSetId={handleSetId}
          handleRemoveId={handleRemoveId}
          {...child}
        >
          <TraversibleNode
            children={children}
            handleSetId={handleSetId}
            handleRemoveId={handleRemoveId}
          />
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={id}
        handleSetId={handleSetId}
        handleRemoveId={handleRemoveId}
        {...child}
      />
    );
  });
};

TraversibleNode.propTypes = {
  dataList: PropTypes.any,
  handleSetId: PropTypes.func,
  handleRemoveId: PropTypes.func,
};

const TreeFilter = ({ title, dataList, currentIds, setIds }) => {
  /**
   * states
   */
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /**
   * handlers
   */
  const handleSetId = useCallback(
    (id) => {
      if (!currentIds.includes(id)) {
        const nextIds = [...currentIds, id];
        setIds(nextIds);
      }
    },
    [currentIds, setIds]
  );
  const handleRemoveId = useCallback(
    (id) => {
      const idIdx = currentIds.indexOf(id);
      if (idIdx > -1) {
        const nextIds = currentIds
          .slice(0, idIdx)
          .concat(currentIds.slice(idIdx + 1));
        setIds(nextIds);
      }
    },
    [currentIds, setIds]
  );

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
          handleSetId={handleSetId}
          handleRemoveId={handleRemoveId}
        />
      )}
    </div>
  );
};

TreeFilter.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.any,
  initialIds: PropTypes.any,
  setIds: PropTypes.func,
};

export default memo(TreeFilter);

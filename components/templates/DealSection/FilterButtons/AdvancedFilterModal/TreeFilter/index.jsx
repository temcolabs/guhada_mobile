import css from './TreeFilter.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import TreeNode from './TreeNode';

const TraversibleNode = ({ dataList, hierarchies, handleSetHierarchies }) => {
  return dataList.map((data) => {
    const checked = hierarchies.includes(data.id);
    if (data.children) {
      return (
        <TreeNode key={data.id} checked={checked} {...data}>
          <TraversibleNode
            dataList={data.children}
            hierarchies={hierarchies}
            handleSetHierarchies={handleSetHierarchies}
          />
        </TreeNode>
      );
    }
    return <TreeNode checked={checked} {...data} />;
  });
};

TraversibleNode.propTypes = {
  dataList: PropTypes.any,
  hierarchies: PropTypes.arrayOf(PropTypes.number),
  handleSelectHirarchies: PropTypes.func,
};

const TreeFilter = ({ title, dataList }) => {
  /**
   * states
   */
  const [isFilterChecked, setIsFilterChecked] = useState(false);
  const [currentHierarchies, setCurrentHierarchies] = useState([]);

  /**
   * handlers
   */
  const handleSetHierarchies = (hierarchies) => {
    setCurrentHierarchies(hierarchies);
  };

  /**
   * render
   */
  return (
    <div className={css['tree']}>
      <div
        className={cn(css['tree__title'], isFilterChecked && css['checked'])}
        onClick={() => setIsFilterChecked(!isFilterChecked)}
      >
        {title}
        {/* <span className={css['tree__title__depth']} /> */}
      </div>
      {isFilterChecked && (
        <TraversibleNode
          dataList={dataList}
          hierarchies={currentHierarchies}
          handleSetHierarchies={handleSetHierarchies}
        />
      )}
    </div>
  );
};

TreeFilter.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.any,
};

export default TreeFilter;

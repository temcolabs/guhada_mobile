import './FilterTree.scss';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';
import { toJS } from 'mobx';

const FilterTree = ({ nodeList }) => {
  const traverse = (nodeList) => {
    return nodeList.map((node) => {
      if (!!node.children) {
        return <TreeNode {...node}>{traverse(node.children)}</TreeNode>;
      }
      return <TreeNode {...node} />;
    });
  };

  return (
    <Tree
      checkable
      expandedKeys={() => {}}
      onSelect={() => {}}
      onCheck={() => {}}
      checkedKeys={() => {}}
      autoExpandParent={true}
    >
      {traverse(nodeList)}
    </Tree>
  );
};

FilterTree.propTypes = {
  nodes: PropTypes.any, // temp
};

export default FilterTree;

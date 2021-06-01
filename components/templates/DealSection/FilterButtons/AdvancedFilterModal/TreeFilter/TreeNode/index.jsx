import css from './TreeNode.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { useState } from 'react';

const TreeNode = ({
  children,
  fullDepthName,
  hierarchies,
  id,
  title,
  checked,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={css['node']}>
      <div
        className={cn(
          css['node__title'],
          !!children && css['filterable'],
          (isOpen || checked) && css['checked']
        )}
        onClick={handleToggleIsOpen}
      >
        <span className={css['node__check']} />
        {title}
      </div>
      {isOpen && children}
    </div>
  );
};

TreeNode.propTypes = {
  titls: PropTypes.string,
  checked: PropTypes.bool,
  children: PropTypes.any,
};

export default TreeNode;

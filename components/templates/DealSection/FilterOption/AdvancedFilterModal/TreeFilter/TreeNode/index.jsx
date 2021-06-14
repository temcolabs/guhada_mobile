import css from './TreeNode.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const TreeNode = ({ children, title, isChecked, handleToggleIsChecked }) => {
  /**
   * states
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * handlers
   */
  const handleToggleIsOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  /**
   * render
   */
  return (
    <div className={css['node']}>
      <div className={css['node__item']}>
        <div
          className={cn(css['node__item__title'], isChecked && css['checked'])}
          onClick={handleToggleIsChecked}
        >
          {title}
        </div>
        {!!children && (
          <div
            className={cn(css['node__item__open'], isOpen && css['open'])}
            onClick={handleToggleIsOpen}
          />
        )}
      </div>
      {isOpen && children}
    </div>
  );
};

TreeNode.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
  isChecked: PropTypes.bool,
  handleToggleIsChecked: PropTypes.func,
};

export default TreeNode;

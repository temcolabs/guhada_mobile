import css from './TreeNode.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const TreeNode = ({
  title,
  id,
  children,
  isChecked,
  handleSetId,
  handleRemoveId,
}) => {
  /**
   * states
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * handlers
   */
  const handleToggleIsChecked = () => {
    if (isChecked) {
      handleRemoveId(id);
    } else {
      handleSetId(id);
    }
  };

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
  title: PropTypes.string,
  id: PropTypes.number,
  children: PropTypes.any,
  isChecked: PropTypes.bool,
  handleSetId: PropTypes.func,
  handleRemoveId: PropTypes.func,
};

export default TreeNode;

import css from './DictionaryNode.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classNames';

const DictionaryNode = ({ title, id, handleSetId, handleRemoveId }) => {
  /**
   * states
   */
  const [isChecked, setIsChecked] = useState(false);

  /**
   * handlers
   */
  const handleToggleIsChecked = () => {
    if (isChecked) {
      handleRemoveId(id);
    } else {
      handleSetId(id);
    }
    setIsChecked(!isChecked);
  };

  return (
    <div
      className={cn(css['node'], isChecked && css['checked'])}
      onClick={handleToggleIsChecked}
    >
      {title}
    </div>
  );
};

DictionaryNode.propTypes = {
  title: PropTypes.string,
  id: PropTypes.number,
  handleSetId: PropTypes.func,
  handleRemoveId: PropTypes.func,
};

export default DictionaryNode;

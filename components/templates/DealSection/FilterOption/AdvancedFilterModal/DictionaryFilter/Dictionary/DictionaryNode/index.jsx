import css from './DictionaryNode.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const DictionaryNode = ({
  title,
  id,
  isChecked,
  handleSetId,
  handleRemoveId,
}) => {
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

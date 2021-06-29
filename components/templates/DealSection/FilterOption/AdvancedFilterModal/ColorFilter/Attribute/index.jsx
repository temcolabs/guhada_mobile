import css from './Attribute.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Attribute = ({ id, colorName, name, isChecked, handleSetFilter }) => (
  <div
    key={id}
    style={{ backgroundColor: name }}
    className={cn(
      css['item'],
      isChecked && css['item--checked'],
      name === '#FFFFFF' && css['item--fff']
    )}
    onClick={() => handleSetFilter(id, colorName)}
  />
);

Attribute.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  isChecked: PropTypes.bool,
  handleSetFilter: PropTypes.func,
};

export default Attribute;

import css from './Attribute.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Attribute = ({ id, title, name, isChecked, handleSetFilter }) => (
  <div
    key={id}
    className={cn(css['item'], isChecked && css['item--checked'])}
    onClick={() => handleSetFilter(id, title)}
  >
    <div>{name}</div>
  </div>
);

Attribute.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  isChecked: PropTypes.bool,
  handleSetFilter: PropTypes.func,
};

export default Attribute;

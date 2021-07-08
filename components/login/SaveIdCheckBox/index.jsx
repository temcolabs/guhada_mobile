import css from './SaveIdCheckBox.module.scss';
import PropTypes from 'prop-types';

const SaveIdCheckBox = ({ id, onChange, checked, children }) => {
  return (
    <div className={css.wrap}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label htmlFor={id}>
        <span className={checked ? 'misc check' : ''} />
        <div>{children}</div>
      </label>
    </div>
  );
};

SaveIdCheckBox.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
};

export default SaveIdCheckBox;

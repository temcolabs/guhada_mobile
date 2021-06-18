import css from './KeywordItem.module.scss';
import PropTypes from 'prop-types';

const KeywordItem = ({ name, date, handleSearch, handleDelete }) => {
  return (
    <div key={name} className={css['keyword-item']}>
      <div className={css['item__name']} onClick={() => handleSearch(name)}>
        {name}
      </div>
      <div className={css['item__delete']} onClick={() => handleDelete(name)}>
        {date}
      </div>
    </div>
  );
};

KeywordItem.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string,
  handleSearch: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default KeywordItem;

import css from './HotKeywordItem.module.scss';
import PropTypes from 'prop-types';

const HotKeywordItem = ({ item, handleClick }) => (
  <div
    className={css.item}
    onClick={() => handleClick(item.searchKeyword || item.keyword)}
  >
    <div
      className={css.image}
      style={{ backgroundImage: `url(${item.url})` }}
    />
    <div className={css.keyword}>{`#${item.keyword}`}</div>
  </div>
);

HotKeywordItem.propTypes = {
  item: PropTypes.shape({
    url: PropTypes.string,
    keyword: PropTypes.string,
    searchKeyword: PropTypes.string,
  }),
  handleClick: PropTypes.func,
};

export default HotKeywordItem;

import css from './SubCategoryMenu.module.scss';
import PropTypes from 'prop-types';

const SubCategoryMenu = ({ on, id, items, handleCategoryItemClick }) => (
  <ul
    style={{ height: on ? `calc(${(items.length + 1) * 33}px + 11px)` : '0' }}
    className={css['category-list']}
  >
    <li
      className={css['category-list__item']}
      onClick={() => handleCategoryItemClick(id)}
    >
      전체보기
    </li>
    {items.map((item) => (
      <li
        className={css['category-list__item']}
        key={item.id}
        onClick={() => handleCategoryItemClick(item.id)}
      >
        {item.title}
      </li>
    ))}
  </ul>
);

SubCategoryMenu.propTypes = {
  id: PropTypes.number,
  items: PropTypes.object,
  handleCategoryItemClick: PropTypes.func,
};

export default SubCategoryMenu;

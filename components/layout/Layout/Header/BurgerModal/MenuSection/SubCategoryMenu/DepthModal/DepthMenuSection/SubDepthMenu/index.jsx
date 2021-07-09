import css from './SubDepthMenu.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';

const SubDepthMenu = ({
  selectedSubcategory,
  item,
  handleCategoryItemClick,
}) => {
  return (
    <div
      style={{
        height:
          selectedSubcategory === item.id
            ? `${Math.ceil((item.children.length + 1) / 2) * 42 + 12}px`
            : '0',
      }}
      className={cn(
        css['list__item__sub'],
        selectedSubcategory === item.id && css['open']
      )}
    >
      <ul className={css['sub']}>
        <li
          className={css['sub__item']}
          onClick={() => handleCategoryItemClick(item.id)}
        >
          전체보기
        </li>
        {item.children.map((item) => (
          <li
            key={item.id}
            className={css['sub__item']}
            onClick={() => handleCategoryItemClick(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

SubDepthMenu.propTypes = {
  selectedSubcategory: PropTypes.number,
  item: PropTypes.object,
  handleCategoryItemClick: PropTypes.func,
};

export default SubDepthMenu;

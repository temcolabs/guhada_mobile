import css from './SubDepthMenu.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';

const SubDepthMenu = ({
  selectedSubcategory,
  item,
  handleCategoryItemClick,
}) => {
  return (
    <ul
      style={{
        height:
          selectedSubcategory === item.id
            ? `${Math.ceil(item.children.length / 2) * 35}px`
            : '0',
      }}
      className={cn(
        css['list__item__sub'],
        selectedSubcategory === item.id && css['open']
      )}
    >
      {item.children.map((item) => (
        <li
          key={item.id}
          className={css['sub-item']}
          onClick={() => handleCategoryItemClick(item.id)}
        >
          {item.title}
        </li>
      ))}
    </ul>
  );
};

SubDepthMenu.propTypes = {
  selectedSubcategory: PropTypes.number,
  item: PropTypes.object,
  handleCategoryItemClick: PropTypes.func,
};

export default SubDepthMenu;

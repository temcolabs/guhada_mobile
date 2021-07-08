import css from './SubCategoryMenu.module.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';
import DepthModal from './DepthModal';

const SubCategoryMenu = ({ open, id, items, handleCategoryItemClick }) => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * render
   */
  return (
    <ul
      style={{
        height: open ? `${(items.length + 1) * 33}px` : '0',
      }}
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
          onClick={() =>
            item.children
              ? setIsModalOpen(item.id)
              : handleCategoryItemClick(item.id)
          }
        >
          {item.children && <span className="icon continue" />}
          {item.title}
        </li>
      ))}
      {isModalOpen > 0 && (
        <DepthModal
          open={isModalOpen > 0}
          id={isModalOpen}
          items={[]}
          handleClose={() => setIsModalOpen(false)}
          height={'100px'}
        />
      )}
    </ul>
  );
};

SubCategoryMenu.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.number,
  items: PropTypes.object,
  handleCategoryItemClick: PropTypes.func,
};

export default SubCategoryMenu;

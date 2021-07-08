import css from './SubCategoryMenu.module.scss';
import PropTypes from 'prop-types';
import { useState } from 'react';
import DepthModal from './DepthModal';

const SubCategoryMenu = ({ open, id, items, handleCategoryItemClick }) => {
  /**
   * states
   */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  /**
   * handlers
   */
  const handleClickItem = (item) => {
    if (item.children) {
      setSelectedItem(item);
      setIsModalOpen(true);
    } else {
      handleCategoryItemClick(item.id);
    }
  };

  /**
   * render
   */
  return (
    <>
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
            onClick={() => handleClickItem(item)}
          >
            {item.children && <span className="icon continue" />}
            {item.title}
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <DepthModal
          item={selectedItem}
          handleClose={() => setIsModalOpen(false)}
          handleCategoryItemClick={handleCategoryItemClick}
        />
      )}
    </>
  );
};

SubCategoryMenu.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.number,
  items: PropTypes.object,
  handleCategoryItemClick: PropTypes.func,
};

export default SubCategoryMenu;

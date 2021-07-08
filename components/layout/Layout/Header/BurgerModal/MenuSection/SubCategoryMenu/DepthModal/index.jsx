import css from './DepthModal.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ModalPortal from 'components/templates/ModalPortal';

const DepthModal = ({ open, id, items, handleClose, height }) => {
  /**
   * states
   */
  const [selectedSubcategory, setSelectedSubcategory] = useState(0);

  /**
   * handlers
   */
  const handleSubcategoryItemClick = (subId) => {
    if (selectedSubcategory === subId) {
      setSelectedSubcategory(0);
    } else {
      setSelectedSubcategory(subId);
    }
  };

  /**
   * render
   */
  return (
    <ModalPortal slide={2}>
      <ul className={css['category-list']}>
        <li className={css['category-list__item']}>전체보기</li>
        {items.map((item) => (
          <li className={css['category-list__item']} key={item.id}>
            <div className={cn(selectedSubcategory === item.id && css['open'])}>
              {item.title}
            </div>
          </li>
        ))}
      </ul>
    </ModalPortal>
  );
};

DepthModal.propTypes = {
  open: PropTypes.bool,
  id: PropTypes.number,
  items: PropTypes.object,
  handleClose: PropTypes.func,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default DepthModal;

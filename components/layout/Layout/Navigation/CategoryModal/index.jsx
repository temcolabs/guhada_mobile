import css from './CategoryModal.module.scss';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import ModalPortal from 'components/templates/ModalPortal';
import MenuSection from 'components/layout/Layout/Header/BurgerModal/MenuSection';
import AdBanner from 'components/layout/Layout/Header/BurgerModal/AdBanner';

const CategoryModal = ({ handleClose }) => {
  /**
   * states
   */
  const router = useRouter();

  /**
   * handlers
   */
  const handlePathClick = (path) => {
    router.push(path);
    handleClose();
  };

  /**
   * render
   */
  return (
    <ModalPortal handleClose={handleClose} slide={1} gutter>
      <div className={css['modal__header']}>
        <div className={css['modal__header__name']}>카테고리</div>
      </div>
      <MenuSection
        handlePathClick={handlePathClick}
        handleClose={handleClose}
        large={true}
        menu={false}
      />
      <div className={css['modal__ad']}>
        <AdBanner handleBeforeClick={handleClose} />
      </div>
    </ModalPortal>
  );
};

CategoryModal.propTypes = {
  handleClose: PropTypes.func,
};

export default CategoryModal;

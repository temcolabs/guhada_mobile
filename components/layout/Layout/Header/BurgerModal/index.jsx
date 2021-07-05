import css from './BurgerModal.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import ModalPortal from 'components/templates/ModalPortal';
import MenuSection from './MenuSection';
import AdBanner from './AdBanner';
import { loginStatus } from 'childs/lib/constant';

const menuList = [
  ['리뷰', '/review'],
  ['랭킹', '/ranking'],
  ['럭키드로우', '/event/luckydraw'],
  ['타임딜', '/event/timedeal'],
  ['기획전', '/event/special'],
  ['이벤트', '/event'],
];

const BurgerModal = ({ handleClose }) => {
  /**
   * states
   */
  const router = useRouter();
  const { login: loginStore } = useStores();

  /**
   * handlers
   */
  const handlePathClick = (path) => {
    router.push(path);
    handleClose();
  };
  const handleLoginClick = () => {
    if (
      loginStore.loginStatus === loginStatus.LOGIN_DONE &&
      loginStore.userInfo
    ) {
      loginStore.logout();
      handleClose();
    } else {
      router.push('/login');
    }
  };

  /**
   * render
   */
  return (
    <ModalPortal handleClose={handleClose} slide={2} closeButton={false}>
      <div className={css['modal__header']}>
        <div className={css['header__login']} onClick={handleLoginClick}>
          {loginStore.loginStatus === loginStatus.LOGIN_DONE &&
          loginStore.userInfo
            ? '로그아웃'
            : '로그인 해주세요'}
          <div className="icon continue" />
        </div>
        <div className={css['header__buttons']}>
          <div className="icon home" onClick={() => handlePathClick('/')} />
          <div className="icon close" onClick={handleClose} />
        </div>
      </div>
      <MenuSection menuList={menuList} handlePathClick={handlePathClick} />
      <div className={css['modal__ad']}>
        <AdBanner handleBeforeClick={handleClose} />
      </div>
    </ModalPortal>
  );
};

BurgerModal.propTypes = {
  handleClose: PropTypes.func,
};

export default observer(BurgerModal);

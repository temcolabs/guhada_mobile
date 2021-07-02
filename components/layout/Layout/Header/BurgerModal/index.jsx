import css from './BurgerModal.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import ModalPortal from 'components/templates/ModalPortal';
import AdBanner from './AdBanner';
import { useVerticalArrows } from 'hooks';
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
  const [scrollRef, arrowTop, arrowBottom] = useVerticalArrows();

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
      <div className={css['modal__section']} ref={scrollRef}>
        <ul className={cn(css['section__menu'], css['section__menu--border'])}>
          <li>
            <span>여성</span>
          </li>
          <li>
            <span>남성</span>
          </li>
          <li>
            <span>키즈</span>
          </li>
          <li>
            <span>브랜드</span>
          </li>
        </ul>
        <ul className={css['section__menu']}>
          {menuList.map(([name, path]) => (
            <li key={name} onClick={() => handlePathClick(path)}>
              <span
                className={cn(
                  (name === '타임딜' || name === '럭키드로우') && css['event']
                )}
              >
                {name}
              </span>
            </li>
          ))}
        </ul>
        {arrowTop && (
          <span className={cn(css['tab-arrow'], css['arrow--top'])} />
        )}
        {arrowBottom && (
          <span className={cn(css['tab-arrow'], css['arrow--bottom'])} />
        )}
      </div>
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

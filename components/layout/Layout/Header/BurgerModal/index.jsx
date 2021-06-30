import css from './BurgerModal.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import ModalPortal from 'components/templates/ModalPortal';
import AdBanner from './AdBanner';
import { useVerticalArrows } from 'hooks';

const BurgerModal = ({ handleClose }) => {
  /**
   * states
   */
  const router = useRouter();
  const { newMain: newMainStore } = useStores();
  const [scrollRef, arrowTop, arrowBottom] = useVerticalArrows();

  /**
   * handlers
   */

  /**
   * render
   */
  return (
    <ModalPortal handleClose={handleClose} slide={2} closeButton={false}>
      <div className={css['modal__header']}>
        <div className={css['header__login']}>
          {true ? '로그인 해주세요' : '로그아웃'}
        </div>
        <div className={css['header__buttons']}>
          <div
            className={cn(css['button'], css['button--home'])}
            onClick={() => {
              router.push('/');
              handleClose();
            }}
          />
          <div
            className={cn(css['button'], css['button--close'])}
            onClick={handleClose}
          />
        </div>
      </div>
      <div className={css['modal__section']}>
        <ul className={cn(css['section__menu'], css['section__menu--border'])}>
          <li>여성</li>
          <li>남성</li>
          <li>키즈</li>
          <li>브랜드</li>
        </ul>
        <ul className={css['section__menu']}>
          <li>리뷰</li>
          <li>랭킹</li>
          <li>타임딜</li>
          <li>럭키드로우</li>
          <li>기획전</li>
          <li>이벤트</li>
        </ul>
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

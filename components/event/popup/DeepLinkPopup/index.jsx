import css from './DeepLinkPopup.module.scss';
import PropTypes from 'prop-types';
import StarItem from 'components/mypage/review/StarItem';
import { isAndroid, isIOS } from 'childs/lib/common/detectMobileEnv';
import ModalPortal from 'components/templates/ModalPortal';
import localStorage from 'childs/lib/common/localStorage';

const STORE_PATH = {
  ios:
    'https://apps.apple.com/kr/app/%EA%B5%AC%ED%95%98%EB%8B%A4-%EB%AA%85%ED%92%88-%EC%87%BC%ED%95%91-%ED%95%84%EC%88%98%EC%95%B1/id1478120259?itsct=apps_box_link&itscg=30200',
};

const DeepLinkPopup = ({ handleClose, deepLink }) => {
  /**
   * handlers
   */
  const handleLinkClick = (link) => {
    if (link) {
      window.location = link;
    }
    handleClose();
  };
  const handleClosePopup = () => {
    localStorage.set('deepLink', false, 10080);
    handleClose();
  };

  /**
   * render
   */
  return (
    <ModalPortal background={false} handleClose={handleClose}>
      <div className={css['popup']}>
        <div className={css['popup__info']}>
          <div className={css['popup__info__logo']} />
          <div className={css['popup__info__desc']}>
            <div className={css['desc__star']}>
              <span>앱스토어 후기</span>
              {StarItem('FIVE')}
            </div>
            <div className={css['desc__text']}>
              "상품 보기도 편하고 결제도 빨라요!"
            </div>
          </div>
        </div>
        <div
          className={css['popup__button']}
          onClick={() => handleLinkClick(deepLink)}
        >
          구하다 앱으로 보기
          <div className={'icon nextnext'} />
        </div>
        <div className={css['popup__close']} onClick={handleClosePopup}>
          괜찮습니다. 모바일 웹으로 볼게요.
        </div>
      </div>
    </ModalPortal>
  );
};

DeepLinkPopup.propTypes = {
  handleClose: PropTypes.func,
  deepLink: PropTypes.string,
};

export default DeepLinkPopup;

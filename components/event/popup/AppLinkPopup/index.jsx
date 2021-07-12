import css from './AppLinkPopup.module.scss';
import PropTypes from 'prop-types';
import StarItem from 'components/mypage/review/StarItem';
import { isIOS, isAndroid } from 'lib/common/detectMobileEnv';
import ModalPortal from 'components/templates/ModalPortal';
import localStorage from 'lib/common/localStorage';
import { useRouter } from 'next/router';
import { LINK_PATH } from './constants';

const AppLinkPopup = ({ handleClose }) => {
  /**
   * states
   */
  const router = useRouter();
  const dealId = router.query.deals;

  const runNativeApp = () => {
    if (isIOS()) {
      // window.location.href = LINK_PATH.universalLink(dealId);
      window.location.href = LINK_PATH.schemeUrl(dealId);
    } else if (isAndroid()) {
      window.location.href = LINK_PATH.intent(dealId);
    } else {
      alert(`Android 또는 IOS 기기로 이용해주세요.`);
    }
  };

  /**
   * handlers
   */
  const handleLinkClick = () => {
    runNativeApp();
    handleClose();
  };
  const handleClosePopup = () => {
    localStorage.set('isDeepLinkModalOff', true, 10080);
    handleClose();
  };

  /**
   * render
   */
  return (
    <ModalPortal
      background={false}
      handleClose={handleClose}
      closeButton={false}
      center
    >
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
        <div className={css['popup__button']} onClick={handleLinkClick}>
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

AppLinkPopup.propTypes = {
  handleClose: PropTypes.func,
};

export default AppLinkPopup;

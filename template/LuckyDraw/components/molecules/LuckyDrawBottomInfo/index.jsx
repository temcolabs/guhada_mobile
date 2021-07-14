import { useState } from 'react';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import useStores from 'stores/useStores';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import css from './LuckyDrawBottomInfo.module.scss';
import { LuckyDrawButton } from 'template/LuckyDraw/components/atoms';

// Modals
const LuckyDrawWarnModal = dynamic(
  () =>
    import('template/LuckyDraw/components/organisms/Modals/LuckyDrawWarnModal'),
  { ssr: false }
);
const LuckyDrawModal = dynamic(
  () => import('template/LuckyDraw/components/organisms/Modals/LuckyDrawModal'),
  { ssr: false }
);

/**
 * 럭키드로우 하단 설명 배너
 * @param {Function} {onClickShareButton 이벤트 공유하기
 * @param {Function} onClickWarnButton} 이벤트 유의사항
 * @returns
 */
function LuckyDrawBottomInfo() {
  const router = Router?.router;
  const { luckyDraw } = useStores();
  const [isActiveWarnModal, setIsActiveWarnModal] = useState(false); // 럭키드로우 유의사항 모달 Flag
  const [isActiveLuckyDrawModal, setIsActiveLuckyDrawModal] = useState(false); // 럭키드로우 모달 Flag

  const onClickShareButton = () => {
    const luckyDrawUrl = `${window.location.protocol}//${window.location.host}${router.asPath}`;
    copy(luckyDrawUrl);
    setIsActiveLuckyDrawModal(true);
  };
  return (
    <>
      {/* 럭키드로우 유의사항 모달 */}
      {isActiveWarnModal && (
        <LuckyDrawWarnModal
          isOpen={isActiveWarnModal}
          onClose={() => setIsActiveWarnModal(false)}
        />
      )}
      {/* 럭키드로우 공통 모달 */}
      {isActiveLuckyDrawModal && (
        <LuckyDrawModal
          isOpen={isActiveLuckyDrawModal}
          status={'CLIP'}
          contents={'공유 링크가 클립보드에 복사되었습니다.'}
          onClose={() => {
            luckyDraw.closeModal();
            setIsActiveLuckyDrawModal(false);
          }}
        />
      )}
      <div className={css.LuckyDrawTopBannerSection}>
        <div className={css.LuckyDrawInfoBanner} />
        <div className={css.LuckyDrawAttendBanner} />
        <div style={{ margin: '0 20px' }}>
          <LuckyDrawButton
            isActive={true}
            contents={'이벤트 공유하기'}
            onClick={onClickShareButton}
          />
        </div>
        <div
          className={css.LuckyDrawWarnInfo}
          onClick={() => setIsActiveWarnModal(true)}
        >
          유의사항
        </div>
      </div>
    </>
  );
}

LuckyDrawBottomInfo.propTypes = {
  onClickShareButton: PropTypes.func,
  onClickWarnButton: PropTypes.func,
};

export default LuckyDrawBottomInfo;

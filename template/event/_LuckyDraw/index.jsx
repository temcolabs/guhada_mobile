import React, { useState } from 'react';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import { useObserver } from 'mobx-react-lite';

import copy from 'copy-to-clipboard';

// layout
import DefaultLayout from 'components/layout/DefaultLayout';

// molecules
import LuckyDrawTop from 'components/molecules/Banners/LuckyDrawTop';
import LuckyDrawEmpty from 'components/molecules/Banners/LuckyDrawEmpty';
import LuckyDrawBottomInfo from 'components/molecules/Banners/LuckyDrawBottomInfo';

// molecules > modals
// TODO : Lazy...
import LuckyDrawWarnModal from 'components/molecules/Modal/LuckyDrawWarnModal';
import LuckyDrawModal from 'components/molecules/Modal/LuckyDrawModal';

// organisms
import LuckyDrawCard from 'components/organisms/Cards/LuckyDrawCard';
import LuckyDrawHistory from 'components/organisms/Sliders/LuckyDrawHistory';

const enhancer = compose(withRouter);
const initialStateLuckyDrawModal = {
  status: '',
  contents: '',
};

/**
 * LuckyDraw Template Component
 * @param {Object} router
 * @param {Object} luckyDraw LuckyDrawStore
 * @returns LuckyDraw
 */
function LuckyDrawTemplate({ router, luckyDraw }) {
  /**
   * states
   */
  const { luckyDrawList, titleList } = luckyDraw?.luckyDrawData;
  const [luckyDrawModalProps, setLuckyDrawModalProps] = useState({
    ...initialStateLuckyDrawModal,
  }); // 럭키드로우 모달 상태값 State

  const [isActiveLuckyDrawModal, setIsActiveLuckyDrawModal] = useState(false); // 럭키드로우 모달 Flag
  const [isActiveWarnModal, setIsActiveWarnModal] = useState(false); // 럭키드로우 유의사항 모달 Flag

  /** side effects **/

  /**
   * handlers
   */

  /**
   * 럭키드로우 이벤트 공유하기
   */
  const onClickShareButton = () => {
    const luckyDrawUrl = `${window.location.protocol}//${window.location.host}${
      router.asPath
    }`;
    copy(luckyDrawUrl);
    setLuckyDrawModalProps({
      status: 'CLIP',
      contents: '공유 링크가 클립보드에 복사되었습니다.',
    });
    setIsActiveLuckyDrawModal(true);
  };

  /**
   * 럭키드로우 당첨자 확인
   * @param {Number} dealId
   */
  const onClickHistroy = async (dealId) => {
    const winnerLuckyDraws = await luckyDraw.checkWinnerLuckyDraws({
      dealId,
    });
    if (winnerLuckyDraws) {
      setLuckyDrawModalProps({
        status: 'WINNER_ANNOUNCEMENT',
        contents: winnerLuckyDraws.userName,
      });
      setIsActiveLuckyDrawModal(true);
    }
  };

  /**
   * 럭키드로우 응모하기
   * @param {Number}} dealId
   */
  const onClickRequestLuckyDraw = async (dealId) => {
    const requestLuckyDraw = await luckyDraw.requestLuckyDraws({ dealId });
    if (requestLuckyDraw) {
      setLuckyDrawModalProps({
        status: 'START',
        contents: '럭키드로우 응모가 완료되었습니다.',
      });
      setIsActiveLuckyDrawModal(true);
    }
  };

  /**
   * helpers
   */

  /**
   * 럭키드로우 응모 가능한 리스트
   */
  const activeList =
    titleList &&
    titleList.length &&
    titleList.map((o1) =>
      luckyDrawList.find(
        (o2) => o1.requestFromAt === o2.requestFromAt && o1.title === o2.title
      )
    );

  /**
   * 럭키드로우 Draw History List
   */
  const winnerList =
    luckyDrawList &&
    luckyDrawList.length &&
    luckyDrawList
      .filter((o) => o.statusCode === 'WINNER_ANNOUNCEMENT')
      .map((obj, i) => {
        if (i % 8 === 0) obj = { ...obj, bgColor: '#004ba9' };
        else if (i % 4 === 0) obj = { ...obj, bgColor: '#00b549' };
        else obj = { ...obj, bgColor: 'white' };
        return obj;
      });

  /**
   * render
   */
  return useObserver(() => (
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
          status={luckyDrawModalProps.status}
          contents={luckyDrawModalProps.contents}
          onClose={() => {
            setLuckyDrawModalProps({ ...initialStateLuckyDrawModal });
            setIsActiveLuckyDrawModal(false);
          }}
        />
      )}
      <DefaultLayout>
        {/* Top Banner */}
        <LuckyDrawTop />

        {/* LuckyDraw Cards */}
        {activeList && activeList.length
          ? activeList.map((o) => (
              <LuckyDrawCard
                {...o}
                key={`luckydraw-${o.dealId}`}
                onClickRequestLuckyDraw={onClickRequestLuckyDraw}
              />
            ))
          : ''}

        {titleList && !titleList.length && <LuckyDrawEmpty />}

        {/* Draw History */}
        {winnerList && winnerList.length && (
          <LuckyDrawHistory
            winnerList={winnerList}
            onClickHistory={onClickHistroy}
          />
        )}

        {/* Bottom Info */}
        <LuckyDrawBottomInfo
          onClickShareButton={onClickShareButton}
          onClickWarnButton={() => setIsActiveWarnModal(true)}
        />
      </DefaultLayout>
    </>
  ));
}

export default enhancer(LuckyDrawTemplate);

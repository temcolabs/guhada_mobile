import React, { useState, useMemo, useEffect } from 'react';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react-lite';

import copy from 'copy-to-clipboard';
import { mainCategory } from 'childs/lib/constant/category';
import { loginStatus } from 'childs/lib/constant';

// layout
import CategorySlider from 'components/common/CategorySlider';
import DefaultLayout from 'components/layout/DefaultLayout';

// molecules
import LuckyDrawTop from 'components/molecules/Banners/LuckyDrawTop';
import LuckyDrawEmpty from 'components/molecules/Banners/LuckyDrawEmpty';
import LuckyDrawBottomInfo from 'components/molecules/Banners/LuckyDrawBottomInfo';

// organisms
import LuckyDrawCard from 'components/organisms/Cards/LuckyDrawCard';
import LuckyDrawHistory from 'components/organisms/Sliders/LuckyDrawHistory';

// Modals
const LuckyDrawWarnModal = dynamic(
  () => import('components/molecules/Modal/LuckyDrawWarnModal'),
  { ssr: false }
);
const LuckyDrawModal = dynamic(
  () => import('components/molecules/Modal/LuckyDrawModal'),
  { ssr: false }
);
// TODO : 모달 > 컴포넌트화
const LuckydrawLogin = dynamic(() => import('template/event/LuckydrawLogin'), {
  ssr: false,
});

// TODO : 모달 > 컴포넌트화
const LuckydrawSignup = dynamic(
  () => import('template/event/LuckydrawSignup'),
  {
    ssr: false,
  }
);

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
function LuckyDrawTemplate({ router, luckyDraw, login, main }) {
  /**
   * states
   */
  const { luckyDrawList } = luckyDraw?.luckyDrawData;
  const [luckyDrawModalProps, setLuckyDrawModalProps] = useState({
    ...initialStateLuckyDrawModal,
  }); // 럭키드로우 모달 상태값 State

  const [isActiveLuckyDrawModal, setIsActiveLuckyDrawModal] = useState(false); // 럭키드로우 모달 Flag
  const [isActiveWarnModal, setIsActiveWarnModal] = useState(false); // 럭키드로우 유의사항 모달 Flag

  /**
   * side effects
   */

  /**
   * 럭키드로우 로그인 / 비로그인 데이터 처리
   */
  useEffect(() => {
    document.documentElement.style.overflow = 'initial';
    luckyDraw.initLuckyEventData();
  }, [login.isLoggedIn]);

  /**
   * 럭키드로우 응모완료 모달 제어
   */
  useEffect(() => {
    setLuckyDrawModalProps(
      luckyDraw.isRequestModal
        ? {
            status: 'START',
            contents: '럭키드로우 응모가 완료되었습니다.',
          }
        : initialStateLuckyDrawModal
    );
    setIsActiveLuckyDrawModal(luckyDraw.isRequestModal);
    return () => {
      setLuckyDrawModalProps(initialStateLuckyDrawModal);
      setIsActiveLuckyDrawModal(false);
    };
  }, [luckyDraw.isRequestModal]);

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
    if (login.loginStatus !== loginStatus.LOGIN_DONE) {
      luckyDraw.setLuckydrawLoginModal(true);
      luckyDraw.luckydrawDealId = dealId;
    } else {
      await luckyDraw.requestLuckyDraws({ dealId });
    }
  };

  /**
   * 럭키드로우 모달 닫기
   */
  const onCloseLuckyDrawModal = () => {
    document.documentElement.style.overflow = 'initial';
    luckyDraw.closeModal();
    setIsActiveLuckyDrawModal(false);
  };

  /**
   * 럭키드로우 유의사항 모달 닫기
   */
  const onCloseLuckyDrawWarnModal = () => {
    document.documentElement.style.overflow = 'initial';
    setIsActiveWarnModal(false);
  };

  /**
   * 럭키드로우 로그인 모달 닫기
   */
  const onCloseLuckyDrawLoginModal = () => {
    document.documentElement.style.overflow = 'initial';
    luckyDraw.setLuckydrawLoginModal(false);
  };

  /**
   * 럭키드로우 회원가입 모달 닫기
   */
  const onCloseLuckyDrawSignupModal = () => {
    document.documentElement.style.overflow = 'initial';
    luckyDraw.setLuckydrawSignupModal(false);
  };

  /**
   * helpers
   */

  /**
   * 럭키드로우 Active List
   */
  const activeList = useMemo(
    () =>
      luckyDrawList &&
      luckyDrawList.length &&
      luckyDrawList.filter(
        (o) =>
          o.statusCode === 'NORMAL' ||
          o.statusCode === 'READY' ||
          o.statusCode === 'START' ||
          o.statusCode === 'REQUESTED'
      ),
    [luckyDrawList]
  );

  /**
   * 럭키드로우 Winner List
   */
  const winnerList = useMemo(
    () =>
      luckyDrawList &&
      luckyDrawList.length &&
      luckyDrawList
        .filter((o) => o.statusCode === 'WINNER_ANNOUNCEMENT')
        .map((obj, i) => {
          if (i % 8 === 0) obj = { ...obj, bgColor: '#004ba9' };
          else if (i % 4 === 0) obj = { ...obj, bgColor: '#00b549' };
          else obj = { ...obj, bgColor: 'white' };
          return obj;
        }),
    [luckyDrawList]
  );

  /**
   * render
   */
  return (
    <>
      {/* 럭키드로우 유의사항 모달 */}
      {isActiveWarnModal && (
        <LuckyDrawWarnModal
          isOpen={isActiveWarnModal}
          onClose={() => onCloseLuckyDrawWarnModal()}
        />
      )}
      {/* 럭키드로우 공통 모달 */}
      {isActiveLuckyDrawModal && (
        <LuckyDrawModal
          isOpen={isActiveLuckyDrawModal}
          status={luckyDrawModalProps.status}
          contents={luckyDrawModalProps.contents}
          onClose={() => onCloseLuckyDrawModal()}
        />
      )}
      {/* 럭키드로우 로그인 모달 */}
      {luckyDraw.luckydrawLoginModal && (
        <LuckydrawLogin
          isOpen={luckyDraw.luckydrawLoginModal}
          closeModal={() => onCloseLuckyDrawLoginModal()}
        />
      )}
      {/* 럭키드로우 회원가입 모달 */}
      {luckyDraw.luckydrawSignupModal && (
        <LuckydrawSignup
          isOpen={luckyDraw.luckydrawSignupModal}
          closeModal={() => onCloseLuckyDrawSignupModal()}
        />
      )}
      <DefaultLayout>
        {/* Nav Category */}
        <CategorySlider
          categoryList={mainCategory.item}
          setNavDealId={main.setNavDealId}
        />

        {/* Top Banner */}
        <LuckyDrawTop />

        {/* LuckyDraw Cards */}
        {luckyDrawList &&
          luckyDrawList.length &&
          (activeList && activeList.length ? (
            activeList.map((o) => {
              return (
                <LuckyDrawCard
                  {...o}
                  key={`luckydraw-${o.dealId}`}
                  onClickRequestLuckyDraw={onClickRequestLuckyDraw}
                />
              );
            })
          ) : (
            <LuckyDrawEmpty />
          ))}

        {/* Draw History */}
        {winnerList && winnerList.length ? (
          <LuckyDrawHistory
            winnerList={winnerList}
            onClickHistory={onClickHistroy}
          />
        ) : (
          ''
        )}

        {/* Bottom Info */}
        <LuckyDrawBottomInfo
          onClickShareButton={onClickShareButton}
          onClickWarnButton={() => setIsActiveWarnModal(true)}
        />
      </DefaultLayout>
    </>
  );
}

export default enhancer(observer(LuckyDrawTemplate));

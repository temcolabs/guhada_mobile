import React, { useState, useMemo, useEffect } from 'react';
import useStores from 'stores/useStores';
import { compose as _compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import { observer } from 'mobx-react';
import { loginStatus } from 'childs/lib/constant';
import LuckyDrawModal from 'template/LuckyDraw/components/organisms/Modals/LuckyDrawModal';
import LuckydrawSignup from 'template/event/LuckydrawSignup';
import LuckydrawLogin from 'template/event/LuckydrawLogin';
import LuckydrawModify from 'template/event/LuckydrawModify';

// molecules
import {
  LuckyDrawTop,
  LuckyDrawEmpty,
  LuckyDrawBottomInfo,
} from 'template/LuckyDraw/components/molecules';

// organisms
import {
  LuckyDrawCard,
  LuckyDrawHistory,
} from 'template/LuckyDraw/components/organisms';

const enhancer = _compose(withRouter);
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
function LuckyDrawTemplate() {
  /**
   * states
   */
  const { luckyDraw, login } = useStores();
  const { luckyDrawList } = luckyDraw?.luckyDrawData;
  const [luckyDrawModalProps, setLuckyDrawModalProps] = useState({
    ...initialStateLuckyDrawModal,
  }); // 럭키드로우 모달 상태값 State

  const [isActiveLuckyDrawModal, setIsActiveLuckyDrawModal] = useState(false); // 럭키드로우 모달 Flag

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
      luckyDraw.luckydrawDealId = dealId;
      luckyDraw.getEventUser();
    }
  };

  /**
   * 럭키드로우 모달 닫기
   */
  const onCloseLuckyDrawModal = () => {
    luckyDraw.closeModal();
    setIsActiveLuckyDrawModal(false);
  };

  /**
   * 럭키드로우 로그인 모달 닫기
   */
  const onCloseLuckyDrawLoginModal = () => {
    luckyDraw.setLuckydrawLoginModal(false);
  };

  /**
   * 럭키드로우 회원가입 모달 닫기
   */
  const onCloseLuckyDrawSignupModal = () => {
    luckyDraw.setLuckydrawSignupModal(false);
  };

  /**
   * 럭키드로우 회원가입 모달 닫기
   */
  const onCloseLuckyDrawModifyModal = () => {
    luckyDraw.setLuckydrawModifyModal(false);
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
      {/* 럭키드로우 인증 수정 모달 */}
      {luckyDraw.luckydrawModifyModal && (
        <LuckydrawModify
          isOpen={luckyDraw.luckydrawModifyModal}
          closeModal={() => onCloseLuckyDrawModifyModal()}
        />
      )}

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
      <LuckyDrawBottomInfo />
    </>
  );
}

export default enhancer(observer(LuckyDrawTemplate));

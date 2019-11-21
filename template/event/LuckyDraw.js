import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DefaultLayout, { MainContents } from 'components/layout/DefaultLayout';
import css from './LuckyDraw.module.scss';
import LuckydrawTimer from 'components/event/luckydraw/LuckydrawTimer';
import LuckyDrawMainSlider from 'components/event/luckydraw/LuckyDrawMainSlider';
import LuckyDrawItem from 'components/event/luckydraw/LuckyDrawItem';
import LuckyDrawApplyModal from 'components/event/luckydraw/LuckyDrawApplyModal';
import LuckyDrawResultModal from 'components/event/luckydraw/LuckyDrawResultModal';
import { compose } from 'lodash/fp';
import { withRouter } from 'next/router';
import { useObserver } from 'mobx-react-lite';
import useStores from 'stores/useStores';
import copy from 'copy-to-clipboard';
import { devLog } from 'childs/lib/common/devLog';
import { pushRoute } from 'lib/router';
import LuckydrawLogin from './LuckydrawLogin';
import LuckydrawSignup from './LuckydrawSignup';
import LuckydrawModify from './LuckydrawModify';
import LoadingPortal from 'components/common/loading/Loading';

const enhancer = compose(withRouter);

function LuckyDraw({ router }) {
  const {
    luckyDraw: luckyDrawStore,
    alert: alertStore,
    user: UserStore,
  } = useStores();

  useEffect(() => {
    luckyDrawStore.getLuckyDrawList();
    return () => {};
  }, [luckyDrawStore]);

  const handleClickShareButton = useCallback(() => {
    copy(`${window.location.host}${router.asPath}`);
    alertStore.showAlert('공유 링크가 클립보드에 복사되었습니다.');
  }, [alertStore, router.asPath]);

  // 첫번째 항목
  const firstItem = useMemo(() => {
    return luckyDrawStore.luckyDrawData?.luckyDrawList?.find((_, i) => i === 0);
  }, [luckyDrawStore.luckyDrawData]);

  const isCountdownVisible = useMemo(() => {
    return (
      firstItem?.remainedTimeForStart <= 0 && firstItem?.remainedTimeForEnd >= 0
    );
  }, [firstItem]);

  devLog(`firstItem`, firstItem);

  return useObserver(() => (
    <DefaultLayout
      pageStyle={{
        backgroundColor: '#13182e',
      }}
      toolBar={false}
    >
      <div className={css.wrap}>
        <main className={css.main}>
          <div className={css.slideWrap}>
            <LuckyDrawMainSlider
              imageList={luckyDrawStore.luckyDrawData?.titleList}
            />
          </div>

          {isCountdownVisible && (
            <div className={css.timerWrap}>
              <LuckydrawTimer initialTimeLeft={firstItem?.remainedTimeForEnd} />
            </div>
          )}

          <div className={css.listWrap}>
            {luckyDrawStore.luckyDrawData?.luckyDrawList?.map((data, index) => {
              return (
                <LuckyDrawItem key={index} data={data} isFirst={index === 0} />
              );
            })}
          </div>

          <div className={css.notificationBox}>
            <img
              src="/static/icon/event/luckydraw-notification.png"
              alt="공지사항"
            />
          </div>
          {UserStore?.userId ? (
            <div className={css.loginArea}>
              <button
                className={css.loginArea__button__full}
                onClick={handleClickShareButton}
              >
                공유하기
              </button>
            </div>
          ) : (
            <div className={css.loginArea}>
              <button
                className={css.loginArea__button}
                onClick={handleClickShareButton}
              >
                공유하기
              </button>
            </div>
          )}
        </main>

        <LuckyDrawApplyModal
          isOpen={luckyDrawStore.isRequestModal}
          data={luckyDrawStore.requestedData}
        />
        <LuckyDrawResultModal
          isOpen={luckyDrawStore.isResultModal}
          data={luckyDrawStore.resultData}
        />

        <LuckydrawLogin
          isOpen={luckyDrawStore.luckydrawLoginModal}
          closeModal={() => luckyDrawStore.setLuckydrawLoginModal(false)}
        />

        <LuckydrawSignup
          isOpen={luckyDrawStore.luckydrawSignupModal}
          closeModal={() => luckyDrawStore.setLuckydrawSignupModal(false)}
        />

        <LuckydrawModify
          isOpen={luckyDrawStore.luckydrawModifyModal}
          closeModal={() => luckyDrawStore.setLuckydrawModifyModal(false)}
        />

        {luckyDrawStore.isOnRequest && <LoadingPortal />}
      </div>
    </DefaultLayout>
  ));
}

export default enhancer(LuckyDraw);

import css from './Home.module.scss';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import sessionStorage from 'lib/common/sessionStorage';
import widerplanetTracker from 'lib/tracking/widerplanet/widerplanetTracker';
import isTruthy from 'lib/common/isTruthy';
import { pushRoute } from 'lib/router';
import { dealOptions } from 'stores/NewMainStore';

import SlideBanner from './SlideBanner';
import FocusOnBanner from './FocusOnBanner';
import SideBanner from './SideBanner';
import RadioDealSection from './RadioDealSection';
import SlideSection from './SlideSection';
import BestReviewItem from './BestReviewItem';
import HotKeywordItem from './HotKeywordItem';

import EventPopup from 'components/event/popup/EventPopup';
import PointSavingModal, {
  pointSavingTypes,
} from 'components/mypage/point/PointSavingModal';

function Home() {
  /**
   * states
   */
  const router = useRouter();
  const { eventpopup: eventPopupStore, newMain: newMainStore } = useStores();
  const [signupModal, setSignupModal] = useState(false);
  const [savedPointResponse, setSavedPointResponse] = useState({});
  const name = 'ALL';

  const {
    initial,
    premiumItem,
    bestItem,
    newIn,
    hotKeyword,
    bestReview,
    mainData,
  } = newMainStore;

  /**
   * side effects
   */
  useEffect(() => {
    const { query } = router;
    if (query.home) {
      pushRoute('/');
    }

    const signupSavedPointResponse = sessionStorage.get('signup');
    // 회원가입 성공 모달 표시
    if (isTruthy(signupSavedPointResponse)) {
      setSignupModal(true);
      setSavedPointResponse(signupSavedPointResponse);
      sessionStorage.remove('signup');
      // 회원가입 전환. 로그인한 상태가 아니어서 유저 아이디를 전달할 수 없다.
      widerplanetTracker.signUp({});
    }
    // let cookie = Cookies.get(key.ACCESS_TOKEN);
    eventPopupStore.appEventPopupOpen();
  }, []);

  /**
   * handlers
   */
  const handleKeywordItemClick = (keyword) => {
    router.push(`/search?keyword=${keyword}`);
  };

  const handleMoreClick = (condition, value) => {
    const { id } = dealOptions.find(({ name }) => name === value);
    router.push(
      `/search?${id > 0 ? `category=${id}&` : ''}condition=${condition}`
    );
  };

  /**
   * render
   */
  return (
    <div className={css['home']}>
      {/* TOP SLIDE BANNER */}
      <SlideBanner />

      {/* FOCUS ON */}
      <FocusOnBanner />

      {/* PREMIUM ITEM */}
      <RadioDealSection
        header={'PREMIUM ITEM'}
        options={dealOptions}
        initialSelected={name}
        dealObject={premiumItem}
        handleMoreClick={(value) => handleMoreClick('PLUS', value)}
        count={10}
        isLoading={initial.premiumItem}
        isLazy={false}
      />

      {/* BANNER */}
      <SideBanner imageList={mainData.mainImageSetTwoSetList} />

      {/* HOT KEYWORD */}
      <SlideSection header={'HOT KEYWORD'} responsive>
        {hotKeyword.map((item) => (
          <HotKeywordItem
            key={item.id}
            item={item}
            handleClick={handleKeywordItemClick}
          />
        ))}
      </SlideSection>

      <div className={css['gutter']} />

      {/* BEST ITEM */}
      <RadioDealSection
        header={'BEST ITEM'}
        options={dealOptions}
        initialSelected={name}
        dealObject={bestItem}
        handleMoreClick={(value) => handleMoreClick('BEST', value)}
        count={6}
        isLoading={initial.bestItem}
      />

      <div className={css['gutter']} />

      {/* BEST REVIEW */}
      <SlideSection header={'BEST REVIEW'}>
        {bestReview.map((item) => (
          <BestReviewItem key={item.id} item={item} />
        ))}
      </SlideSection>

      {/* BANNER */}
      <SideBanner imageList={mainData.mainImageSetThreeList} />

      {/* NEW IN */}
      <RadioDealSection
        header={'NEW IN'}
        options={dealOptions}
        initialSelected={name}
        dealObject={newIn}
        handleMoreClick={(name) => handleMoreClick('NEW', name)}
        count={6}
        isLoading={initial.newIn}
      />

      {/* BENEFITS BANNER */}
      <SideBanner imageList={newMainStore.mainData.mainImageSetFourList} />

      {/* MODALS */}
      {eventPopupStore.popupList.length > 0 &&
        eventPopupStore.popupList.map(
          (data, idx) =>
            data.popupStatus && (
              <EventPopup
                shade={idx === 0 ? true : false}
                key={data.id}
                data={data}
                handleClose={eventPopupStore.appEventPopupClose}
              />
            )
        )}
      {signupModal && (
        <PointSavingModal
          isOpen={signupModal}
          pointSavingType={pointSavingTypes.SIGNUP}
          savedPointResponse={savedPointResponse}
          onClose={() => setSignupModal(false)}
        />
      )}
    </div>
  );
}

export default observer(Home);

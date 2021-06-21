import css from './Home.module.scss';
import { useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';

import sessionStorage from 'childs/lib/common/sessionStorage';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';
import isTruthy from 'childs/lib/common/isTruthy';
import { pushRoute } from 'childs/lib/router';

import AppEventPopup from 'components/event/popup/AppEventPopup';
import PointSavingModal, {
  pointSavingTypes,
} from 'components/mypage/point/PointSavingModal';

import { dealOptions } from 'stores/NewMainStore';
import SlideBanner from './SlideBanner';
// import FocusBanner from './FocusBanner';
import MainSideBanner from 'components/home/MainSideBanner';
import RadioDealSection from './RadioDealSection';
import Banner from './Banner';
import SlideSection from './SlideSection';

import BestReviewItem from './BestReviewItem';
import HotKeywordItem from './HotKeywordItem';

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
    premiumItem,
    bestItem,
    newIn,
    hotKeyword,
    bestReview,
    mainData,
    loadable,
  } = newMainStore;

  /**
   * side effects
   */
  useEffect(() => {
    const { query, asPath } = router;
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
      {/* <SlideBanner imageFile={mainData.mainBannerList} /> */}

      {/* FOCUS ON */}
      {/* <MainSideBanner
        title={'FOCUS ON'}
        type={'FOCUS_ON'}
        list={mainData.mainImageSetOneSetList}
      /> */}

      {/* PREMIUM ITEM */}
      <RadioDealSection
        header={'PREMIUM ITEM'}
        options={dealOptions}
        initialSelected={name}
        dealObject={premiumItem}
        handleMoreClick={(value) => handleMoreClick('PLUS', value)}
        count={10}
        isLazy={false}
      />

      {/* BANNER */}
      <Banner dataList={mainData.mainImageSetTwoSetList} />

      {/* HOT KEYWORD */}
      <SlideSection header={'HOT KEYWORD'}>
        {hotKeyword.map((item) => (
          <HotKeywordItem item={item} handleClick={handleKeywordItemClick} />
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
      />

      <div className={css['gutter']} />

      {/* BEST REVIEW */}
      <SlideSection header={'BEST REVIEW'}>
        {bestReview.map((item) => (
          <BestReviewItem item={item} />
        ))}
      </SlideSection>

      {/* BANNER */}
      <Banner dataList={mainData.mainImageSetThreeList} />

      {/* BEST ITEM */}
      <RadioDealSection
        header={'NEW IN'}
        options={dealOptions}
        initialSelected={name}
        dealObject={newIn}
        handleMoreClick={(name) => handleMoreClick('NEW', name)}
        count={6}
      />

      {/* EVENT BANNER */}
      <Banner dataList={mainData.mainImageSetFourList} />

      {/* MODALS */}
      {eventPopupStore.popupList.length > 0 &&
        eventPopupStore.popupList.map((data, index) => (
          <Fragment key={index}>
            {data.popupStatus && (
              <AppEventPopup isOpen={data.popupStatus} data={data} />
            )}
          </Fragment>
        ))}
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

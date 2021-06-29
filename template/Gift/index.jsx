import css from './Gift.module.scss';
import { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import GiftHeader from './GiftHeader';
import DealItems from 'components/organisms/DealItems';
import ScrollableImageModal from './ScrollableImageModal';

function Gift() {
  /**
   * states
   */
  const { gift: giftStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * render
   */
  return (
    <div className={css.gift}>
      <GiftHeader handleOpenModal={() => setIsModalOpen(true)} />
      <DealItems
        title={'추천 기프트'}
        deals={giftStore.recommendDeals}
        thumbnail={-1}
        isLazy={false}
      />
      <DealItems
        title={'베스트 기프트'}
        deals={giftStore.bestDeals}
        isLazy={false}
      />

      {isModalOpen && (
        <ScrollableImageModal
          imgSrc={'/static/gift/gift_detail_mob.jpg'}
          isModalOpen={isModalOpen}
          handleCloseModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default observer(Gift);

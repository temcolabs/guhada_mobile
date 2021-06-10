import css from './Gift.module.scss';
import { useState } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import GiftHeader from './GiftHeader';
import DealItems from 'components/organisms/DealItems';
import ScrollableImageModal from './ScrollableImageModal';
import MountLoading from 'components/atoms/Misc/MountLoading';

function Gift() {
  /**
   * states
   */
  const { gift: giftStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={css.gift}>
        {giftStore.isLoading && <MountLoading />}
        <GiftHeader handleOpenModal={() => setIsModalOpen(true)} />
        <DealItems
          title={'추천 기프트'}
          deals={giftStore.recommendDeals}
          thumbnail={-1}
        />
        <DealItems title={'베스트 기프트'} deals={giftStore.bestDeals} />
      </div>

      {isModalOpen && (
        <ScrollableImageModal
          imgSrc={'/static/gift/gift_detail_mob.jpg'}
          isModalOpen={isModalOpen}
          handleCloseModal={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default observer(Gift);

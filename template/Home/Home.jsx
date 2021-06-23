import css from './Home.module.scss';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import useStores from 'stores/useStores';
import { dealOptions } from 'stores/NewMainStore';
import RadioDealSection from './RadioDealSection';
import SlideSection from './SlideSection';
import HotKeywordItem from './HotKeywordItem';

function Home({ name }) {
  /**
   * states
   */
  const router = useRouter();
  const { newMain: newMainStore } = useStores();
  const { premiumItem, bestItem, newIn, hotKeyword } = newMainStore;

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
      {/* PREMIUM ITEM */}
      <RadioDealSection
        radio={false}
        header={'PREMIUM ITEM'}
        options={dealOptions}
        initialSelected={name}
        dealObject={premiumItem}
        handleMoreClick={(value) => handleMoreClick('PLUS', value)}
        count={50}
        isLoading={premiumItem[name].length === 0}
        isLazy={false}
      />

      <div className={css['gutter']} />

      {/* BEST ITEM */}
      <RadioDealSection
        radio={false}
        header={'BEST ITEM'}
        options={dealOptions}
        initialSelected={name}
        dealObject={bestItem}
        handleMoreClick={(value) => handleMoreClick('BEST', value)}
        count={50}
        isLoading={bestItem[name].length === 0}
      />

      <div className={css['gutter']} />

      {/* NEW IN */}
      <RadioDealSection
        radio={false}
        header={'NEW IN'}
        options={dealOptions}
        initialSelected={name}
        dealObject={newIn}
        handleMoreClick={(name) => handleMoreClick('NEW', name)}
        count={50}
        isLoading={newIn[name].length === 0}
      />

      <div className={css['gutter']} />

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
    </div>
  );
}

export default observer(Home);

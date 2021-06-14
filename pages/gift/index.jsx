import { useEffect } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useScrollDirection } from 'hooks';
import { mainCategory } from 'childs/lib/constant/category';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import DefaultLayout from 'components/layout/DefaultLayout';
import CategorySlider from 'components/common/CategorySlider';
import Footer from 'components/footer/Footer';
import Gift from 'template/Gift';

function GiftPage() {
  /**
   * states
   */
  const { main: mainStore, gift: giftStore } = useStores();
  const scrollDirection = useScrollDirection();

  /**
   * side effects
   */
  useEffect(() => {
    giftStore.fetchDeals();
  }, [giftStore]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO pageName="선물하기" />
      <DefaultLayout
        title={null}
        topLayout={'main'}
        scrollDirection={scrollDirection}
      >
        <CategorySlider
          categoryList={mainCategory.item}
          setNavDealId={mainStore.setNavDealId}
          scrollDirection={scrollDirection}
        />
        <Gift />
        <Footer />
      </DefaultLayout>
    </>
  );
}

export default observer(withScrollToTopOnMount(GiftPage));

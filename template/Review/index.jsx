import { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import cn from 'classnames';
import _ from 'lodash';

import useStores from 'stores/useStores';
import { mainCategory } from 'childs/lib/constant/category';

import DefaultLayout from 'components/layout/DefaultLayout';
import Footer from 'components/footer/Footer';
import CategorySlider from 'components/common/CategorySlider';

function ReviewTemplate() {
  /**
   * states
   */
  const { main: mainStore, review: reviewStroe } = useStores();
  const [scrollDirection, setScrollDirection] = useState('up');
  let lastScrollTop = 0;

  /**
   * side effects
   */
  useEffect(() => {
    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [handleScrollDirection]);

  /**
   * handlers
   */
  // TODO : Hooks 사용
  const handleScrollDirection = useCallback(
    _.debounce((e) => {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollTop = st <= 0 ? 0 : st;
    }, 10),
    []
  );

  return (
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

      <Footer />
    </DefaultLayout>
  );
}

export default observer(ReviewTemplate);

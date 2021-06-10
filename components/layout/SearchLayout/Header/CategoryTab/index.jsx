import css from './CategoryTab.module.scss';
import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useHorizontalArrows } from 'hooks';

const CategoryTab = () => {
  /**
   * states
   */
  const { searchByFilter: searchByFilterStore } = useStores();
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows();

  /**
   * render
   */
  return (
    <div className={css['category-tab']} ref={scrollRef}>
      <div className={cn(css['tab-item'], css['selected'])}>전체보기</div>
      <div className={cn(css['tab-item'])}>의류</div>
      <div className={cn(css['tab-item'])}>슈즈</div>
      <div className={cn(css['tab-item'])}>가방</div>
      <div className={cn(css['tab-item'])}>액세사리</div>
      <div className={cn(css['tab-item'])}>지갑</div>
      <div className={cn(css['tab-item'])}>바지</div>
      {arrowLeft && (
        <span className={cn(css['tab-arrow'], css['arrow--left'])} />
      )}
      {arrowRight && (
        <span className={cn(css['tab-arrow'], css['arrow--right'])} />
      )}
    </div>
  );
};

export default observer(CategoryTab);

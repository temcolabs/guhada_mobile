import css from './SubmenuTab.module.scss';
import { observer } from 'mobx-react';
import cn from 'classnames';
import useStores from 'stores/useStores';
import { useHorizontalArrows } from 'hooks';
import { useRouter } from 'next/router';

const pathMap = {
  women: 0,
  men: 1,
  kids: 2,
};

function SubmenuTab() {
  /**
   * states
   */
  const router = useRouter();
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows();
  const { category: categoryStore } = useStores();
  const path = router.pathname.split('/');
  const categoryList = categoryStore.category[pathMap[path[path.length - 1]]];

  /**
   * handlers
   */
  const handleClick = (id) => {
    router.push(`/search?category=${id}`);
  };
  const handleScrollLeft = () => {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft - 330,
      behavior: 'smooth',
    });
  };
  const handleScrollRight = () => {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + 330,
      behavior: 'smooth',
    });
  };

  /**
   * render
   */
  return (
    <div className={css['menu-tab']} ref={scrollRef}>
      {categoryList && (
        <>
          <div
            key={categoryList.id}
            className={cn(css['tab-item'])}
            onClick={() => handleClick(categoryList.id)}
          >
            전체보기
          </div>
          {categoryList.children.map((item) => (
            <div
              key={item.id}
              className={cn(css['tab-item'])}
              onClick={() => handleClick(item.id)}
            >
              {item.title}
            </div>
          ))}
        </>
      )}
      {arrowLeft && (
        <span
          className={cn(css['tab-arrow'], css['arrow--left'])}
          onClick={handleScrollLeft}
        />
      )}
      {arrowRight && (
        <span
          className={cn(css['tab-arrow'], css['arrow--right'])}
          onClick={handleScrollRight}
        />
      )}
    </div>
  );
}

export default observer(SubmenuTab);

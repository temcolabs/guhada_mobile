import css from './CategoryTab.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useHorizontalArrows } from 'hooks';
import { useRouter } from 'next/router';

const CategoryTab = () => {
  /**
   * states
   */
  const { layout: layoutStore } = useStores();
  const { category } = layoutStore.headerInfo;
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows([category]);
  const router = useRouter();

  /**
   * handlers
   */
  const handleClick = (id, target, replace = false) => {
    new Promise((res) =>
      res(
        id &&
          id !== category.id &&
          layoutStore.pushState(
            Object.assign(window.history.state, {
              url: `/search?category=${id}`,
              as: `/search?category=${id}`,
              query: { category: id },
            }),
            replace
          )
      )
    ).then(() => scrollRef.current.scrollTo(target.offsetLeft - 30, 0));
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
    <ul className={css['category-tab']} ref={scrollRef}>
      {category &&
        (category.children ? (
          <>
            <li
              className={cn(css['tab-item'], css['selected'])}
              onClick={(e) => handleClick(undefined, e.target)}
            >
              전체보기
            </li>
            {category.children.map(({ id, title }) => (
              <li
                key={id}
                className={css['tab-item']}
                onClick={(e) => handleClick(id, e.target)}
              >
                {title}
              </li>
            ))}
          </>
        ) : (
          <>
            <li
              className={css['tab-item']}
              // onClick={(e) => handleClick(category.parent.id, e.target, true)}
              onClick={router.back}
            >
              전체보기
            </li>
            {category.parent.children.map(({ id, title, children }) => (
              <li
                key={id}
                className={cn(
                  css['tab-item'],
                  category.id === id && css['selected']
                )}
                onClick={(e) => handleClick(id, e.target, !children)}
              >
                {title}
              </li>
            ))}
          </>
        ))}
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
    </ul>
  );
};

export default observer(CategoryTab);

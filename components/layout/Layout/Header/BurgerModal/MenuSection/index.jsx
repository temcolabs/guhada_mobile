import css from './MenuSection.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useVerticalArrows } from 'hooks';

const MenuSection = ({ menuList, handlePathClick, modalHeight }) => {
  /**
   * states
   */
  const [scrollRef, arrowTop, arrowBottom] = useVerticalArrows();

  /**
   * render
   */
  return (
    <div
      style={{ height: `calc(${modalHeight}px - (7 / 18) * 100vw - 80px)` }}
      className={css['modal__section']}
      ref={scrollRef}
    >
      <ul className={cn(css['section__menu'], css['section__menu--border'])}>
        <li>
          <span>여성</span>
        </li>
        <li>
          <span>남성</span>
        </li>
        <li>
          <span>키즈</span>
        </li>
        <li>
          <span>브랜드</span>
        </li>
      </ul>
      <ul className={css['section__menu']}>
        {menuList.map(([name, path]) => (
          <li key={name} onClick={() => handlePathClick(path)}>
            <span
              className={cn(
                (name === '타임딜' || name === '럭키드로우') && css['event']
              )}
            >
              {name}
            </span>
          </li>
        ))}
      </ul>
      {arrowTop && <span className={cn(css['tab-arrow'], css['arrow--top'])} />}
      {arrowBottom && (
        <span className={cn(css['tab-arrow'], css['arrow--bottom'])} />
      )}
    </div>
  );
};

MenuSection.propTypes = {
  menuList: PropTypes.array,
  handlePathClick: PropTypes.func,
  modalHeight: PropTypes.number,
};

export default MenuSection;

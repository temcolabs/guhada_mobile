import css from './ArticleBookmarkButton.module.scss';
import cn from 'classnames';

const ArticleBookmarkButton = ({ toggleBookmark = () => {}, isOn = false }) => {
  return (
    <button
      className={cn({ [css.isOn]: isOn }, css.button)}
      onClick={() => toggleBookmark({ isOn })}
    />
  );
};

export default ArticleBookmarkButton;

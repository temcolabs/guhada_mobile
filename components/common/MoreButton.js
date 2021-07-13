import css from './MoreButton.module.scss';
function MoreButton({ getMoreContent = () => {}, wrapStyle = {} }) {
  return (
    <div
      className={css.more}
      style={wrapStyle}
      onClick={() => {
        getMoreContent();
      }}
    >
      더 보기
      <i className={css.detailBtn} />
    </div>
  );
}
export default MoreButton;

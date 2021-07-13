import css from './MypageDataEmpty.module.scss';

function MypageDataEmpty({ text }) {
  return (
    <div className={css.wrap}>
      <div className={css.infoIcon} />
      <div>{text}</div>
    </div>
  );
}

export default MypageDataEmpty;

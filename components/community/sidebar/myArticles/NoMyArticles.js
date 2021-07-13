import css from './NoMyActivity.module.scss';

export default function NoMyArticles() {
  return (
    <div className={css.wrap}>
      <div>
        <img
          src="/public/icon/community/icon-wirte-non@3x.png"
          alt="icon-wirte-non@3x.png"
          className={css.notiImage}
        />
        <div className={css.notiText}>활동 내역이 없습니다.</div>
      </div>
    </div>
  );
}

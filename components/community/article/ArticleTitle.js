import css from './ArticleTitle.module.scss';
import moment from 'moment';
import { useObserver } from 'mobx-react';

/**
 * 게시판 글 타이틀 영역
 */
const ArticleTitle = ({
  title,
  categoryFilterName,
  commentCount,
  hitCount,
  likeCount,
  createdTimestamp,
  userName,
}) => {
  return useObserver(() => (
    <div className={css.wrap}>
      {/* 제목 */}
      <h1 className={css.title}>
        {/* 카테고리필터 */}
        {categoryFilterName && (
          <span className={css.category}>{`[${categoryFilterName}]`}</span>
        )}
        {title || ' '}
      </h1>

      {/* 게시글 정보 */}
      <div className={css.articleInfo}>
        <div className={css.articleInfo_user}>
          <span className={css.articleInfo_username}>
            {/* TODO: 등급은 추후 추가 */}
            {/* <span className={css.articleInfo_memberGrade}>{'GRADE'}</span> */}
            <span>{userName}</span>
          </span>
          <span className={css.articleInfo_created}>
            {moment(createdTimestamp).format('YY. MM. DD HH:mm')}
          </span>
        </div>

        <div className={css.articleInfo_counts}>
          <span className={css.articleInfo_read}>조회 {hitCount}</span>

          {/* TODO: 좋아요 기능 추가 후 주석 제거*/}
          <span className={css.articleInfo_like}>좋아요 {likeCount}</span>

          <span className={css.articleInfo_comment}>댓글 {commentCount}</span>
        </div>
      </div>
    </div>
  ));
};

export default ArticleTitle;

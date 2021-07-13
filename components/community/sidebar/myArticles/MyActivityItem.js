import css from '../MyBBS.module.scss';
import { LinkRoute, pushRoute } from 'lib/router';
import moment from 'moment';
import { dateFormat } from 'lib/constant';

export default function MyActivityItem({ activity }) {
  const {
    contentsType,
    id,
    contents,
    orgContents,
    viewCount,
    commentCount,
    // createdAt,
    createdTimestamp,
    bbsId,
  } = activity;

  return (
    <div
      className={css.myContent}
      onClick={() => {
        // 게시글, 댓글로 이동
        const redirectTo =
          contentsType === 'BBS'
            ? `/community/article/${id}`
            : contentsType === 'COMMENT'
            ? `/community/article/${bbsId}`
            : null;

        pushRoute(redirectTo);
      }}
    >
      <div className={css.myContent_title}>
        <span className={css.myContent_category}>
          {contentsType === 'BBS'
            ? '게시글'
            : contentsType === 'COMMENT'
            ? '댓글'
            : ''}
        </span>
        <span className={css.myContent_titleText}>
          {/* FIXME: 내용 없는 글에 임의로 텍스트 추가함 */}
          {contents || '(내용 없음)'}
        </span>
      </div>

      <div className={css.myContent_info}>
        {contentsType === 'BBS' ? (
          <>
            <span>조회 {viewCount}</span>
            <span>댓글 {commentCount}</span>
            <span>
              {moment(createdTimestamp).format(dateFormat.YYYYMMDD_UI)}
            </span>
          </>
        ) : contentsType === 'COMMENT' ? (
          <>
            <span className={css.myContent_originalContent}>
              원글 : {orgContents}
            </span>
            <span>
              {moment(createdTimestamp).format(dateFormat.YYYYMMDD_UI)}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}

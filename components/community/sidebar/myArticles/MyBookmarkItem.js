import css from '../MyBBS.module.scss';
import { pushRoute } from 'lib/router';
import moment from 'moment';

export default function MyBookmarkItem({ bookmark }) {
  const {
    communityBbsResponse = {},
    communityBbsId,
    createdTimestamp,
  } = bookmark;

  const {
    commentCount,
    hitCount,
    title,
    // bookmark: true
    // categoryFilterId: 1
    // categoryId: 1
    // contents: "<p><img src="https://d3ikprf0m31yc7.cloudfront.net/images/community/bbs/d3a8823371cf46c0af7ce9d2f3759158" style=""></p><p><br></p><p>ㅋㅋㅋ</p>"
    // createUserInfo: {id: 281,…}
    // createdTimestamp: 1564733798000
    // currentTimestamp: 1564734325000
    // delete,
    // deletedAt: null
    // deletedTimestamp: null
    // dspCreatedAt: "8분전"
    // id: 282275
    imageUrl,
    // like: false
    // likeCount: 0
    // use: true
    // userId: 281
  } = communityBbsResponse;

  return (
    <div
      className={css.myBookmark}
      onClick={() => {
        // 게시글, 댓글로 이동
        const redirectTo = `/community/article/${communityBbsId}`;
        pushRoute(redirectTo);
      }}
    >
      {imageUrl && (
        <div
          className={css.myBookmark_thumbnail}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className={css.myBookmark_contentsWrap}>
        <div className={css.myBookmark_title}>{title || ''}</div>

        <div className={css.myBookmark_info}>
          <span>조회 {hitCount}</span>
          <span>댓글 {commentCount}</span>
          <span>{moment(createdTimestamp).format('YY.MM.DD')}</span>
        </div>
      </div>
    </div>
  );
}

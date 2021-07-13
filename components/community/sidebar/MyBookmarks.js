import { useEffect } from 'react';
import css from './MyBBS.module.scss';
import { LinkRoute } from 'lib/router';
import { useBBSStore } from 'stores/bbs';
import { useObserver } from 'mobx-react';
import DeletedMyActivityItem from './myArticles/DeletedMyActivityItem';
import MyBookmarkItem from './myArticles/MyBookmarkItem';
import NoMyBookmarks from './myArticles/NoMyBookmarks';
import cn from 'classnames';
import useHandleScrollMyBBS from './myArticles/useHandleScrollMyBBS';

/**
 * 내 북마크 목록
 */
function MyBookmarks() {
  const { myBBS, article } = useBBSStore();

  useEffect(() => {
    myBBS.getMyBookmarks();

    return () => {
      myBBS.myBookmarks = [];
    };
  }, [myBBS]);

  const [isOnScroll, handleScrollMyBBS] = useHandleScrollMyBBS();

  return useObserver(() =>
    myBBS.isNoMyBookmark ? (
      <NoMyBookmarks />
    ) : (
      <div
        className={cn(css.myContentContainer_scrollArea, {
          [css.isOnScroll]: isOnScroll,
        })}
        onScroll={handleScrollMyBBS}
      >
        {myBBS.myBookmarks.map((bookmark, index) => {
          return !bookmark.communityBbsResponse?.delete ? (
            <MyBookmarkItem key={index} bookmark={bookmark} />
          ) : (
            <DeletedMyActivityItem
              key={index}
              onDelete={() => {
                // 북마크에서 제거한다
                article.removeBookmarkFromArticle({
                  communityBbsId: bookmark.communityBbsId,
                });
              }}
            />
          );
        })}
        {/* TODO: 10개 이상일 때 내가 쓴 글 전체보기 메뉴로 이동 */}
        {myBBS.myBookmarks.length > 10 && (
          <LinkRoute href="/mypage">
            <a className={css.myContent_showAllButton}>전체보기</a>
          </LinkRoute>
        )}
      </div>
    )
  );
}

export default MyBookmarks;

import React, { useEffect } from 'react';
import css from './MyBBS.module.scss';
import cn from 'classnames';
import { LinkRoute } from 'childs/lib/router';
import { useBBSStore } from 'stores/bbs';
import { useObserver } from 'mobx-react-lite';
import DeletedMyActivityItem from './myArticles/DeletedMyActivityItem';
import MyActivityItem from './myArticles/MyActivityItem';
import NoMyArticles from './myArticles/NoMyArticles';
import useHandleScrollMyBBS from './myArticles/useHandleScrollMyBBS';

/**
 * 내가 쓴 글
 */
function MyArticles() {
  const { myBBS, comments } = useBBSStore();

  useEffect(() => {
    myBBS.getMyActivity();
    return () => {
      myBBS.myActivities = [];
    };
  }, [myBBS]);

  const [isOnScroll, handleScrollMyBBS] = useHandleScrollMyBBS();

  /**
   * 내가 쓴 댓글의 원글이 삭제되었을 때 해당 댓글을 삭제할 수 있는 기능을 제공한다.
   */
  const deleteMyActivityOfDeletedArticle = async (activity = {}) => {
    // 댓글일 때
    if (activity.contentsType === 'COMMENT') {
      try {
        // 해당 댓글 삭제
        await comments.deleteComment({
          id: activity.id,
        });

        // 목록 새로고침
        await myBBS.getMyActivity();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return useObserver(() => (
    <>
      {myBBS.isNoMyActivity ? (
        <NoMyArticles />
      ) : (
        <div
          className={cn(css.myContentContainer_scrollArea, {
            [css.isOnScroll]: isOnScroll,
          })}
          onScroll={handleScrollMyBBS}
        >
          {myBBS.myActivities.map((activity, index) =>
            !activity.delete ? (
              <MyActivityItem key={index} activity={activity} />
            ) : (
              <DeletedMyActivityItem
                key={index}
                onDelete={() => deleteMyActivityOfDeletedArticle(activity)}
              />
            )
          )}

          {/* TODO: 10개 이상일 때 내가 쓴 글 전체보기 메뉴로 이동 */}
          {myBBS.myActivities.length > 10 && (
            <LinkRoute href="/mypage">
              <a className={css.myContent_showAllButton}>전체보기</a>
            </LinkRoute>
          )}
        </div>
      )}
    </>
  ));
}

export default MyArticles;

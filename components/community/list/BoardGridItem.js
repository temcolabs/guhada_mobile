import React from 'react';
import css from './BoardGridItem.module.scss';
import { LinkRoute } from 'childs/lib/router';
import moment from 'moment';
import cn from 'classnames';

export const BoardGridContainer = ({ children }) => {
  return <div className={css.boardGridContainer}>{children}</div>;
};

export default function BoardGridItem({ bbs = {} }) {
  return (
    <LinkRoute href={`/community/article/${bbs.bbsId}`}>
      <a className={css.gridItem}>
        <div className={css.imageContainer}>
          <div
            className={css.productImage}
            style={{ backgroundImage: `url(${bbs.imageUrl})` }}
          />
        </div>

        <div className={css.infoContainer}>
          <div className={css.title}>
            <div className={css.title_text}>{bbs.title}</div>
            <div className={css.title_commentAndNew}>
              {bbs.comments > 0 && (
                <span className={css.title_commentCount}>({bbs.comments})</span>
              )}
              <span className={cn({ [css.title_newIcon]: bbs.newlyCreated })} />
            </div>
          </div>

          <div className={css.itemInfo}>
            <div className={css.itemInfo_username}>
              {/* <span className={css.itemInfo_memberGrade}>{'TODO:'}</span> */}
              <span>{bbs.userName}</span>
            </div>

            <div className={css.itemInfo_counts}>
              {/* TODO: 좋아요 기능 추가 후 주석 제거*/}
              {/* <span className={css.itemInfo_like}>좋아요 {bbs.likes}</span> */}

              <span className={css.itemInfo_read}>조회 {bbs.views}</span>
              <span className={css.itemInfo_created}>
                {moment(bbs.date).format('YY.MM.DD')}
              </span>
            </div>
          </div>
        </div>
      </a>
    </LinkRoute>
  );
}

import React from 'react';
import css from './BoardListItem.module.scss';
import { LinkRoute } from 'childs/lib/router';
import moment from 'moment';
import cn from 'classnames';

/**
 * 게시판 목록 항목
 * @param {*} bbs 게시글 데이터
 */
const BoardListItem = ({ bbs = {}, wrapperStyle = {} }) => {
  return (
    <LinkRoute href={`/community/article/${bbs.bbsId}`}>
      <a className={css.wrap} style={wrapperStyle}>
        {!!bbs.imageUrl && (
          <div className={css.imageContainer}>
            <div
              className={css.productImage}
              style={{ backgroundImage: `url(${bbs.imageUrl})` }}
            />
          </div>
        )}

        <div className={css.infoContainer}>
          <div className={css.title}>
            {/* categoryFilter */}
            {!!bbs.categoryFilterName && (
              <span className={css.itemInfo_categoryFilter}>
                {bbs.categoryFilterName}
              </span>
            )}
            <span className={css.title_text}>{bbs.title}</span>
            {bbs.comments > 0 && (
              <span className={css.title_commentCount}>({bbs.comments})</span>
            )}
            <span className={cn({ [css.title_newIcon]: bbs.newlyCreated })} />
          </div>

          <div className={css.itemInfo}>
            {/* TODO: 좋아요는 추후 추가 */}
            <span className={css.itemInfo_like}>
              좋아요 {bbs.likes > 0 ? bbs.likes : 0}
            </span>
            <span className={css.itemInfo_read}>
              조회 {bbs.views > 0 ? bbs.views : 0}
            </span>
            <span className={css.itemInfo_created}>
              {moment(bbs.date).format('YY.MM.DD')}
            </span>

            {!!bbs.userName && (
              <span className={css.itemInfo_username}>
                {/* 멤버 등급 */}
                {/* <span className={css.itemInfo_memberGrade}>{'TODO:'}</span> */}
                {/* <span>&nbsp;</span> */}

                {/* 작성자 닉네임 */}
                <span>{bbs.userName}</span>
              </span>
            )}
          </div>
        </div>
      </a>
    </LinkRoute>
  );
};

export default BoardListItem;

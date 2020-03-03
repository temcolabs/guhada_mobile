import React from 'react';
import css from '../MyBBS.module.scss';
import cn from 'classnames';
import isFunction from 'childs/lib/common/isFunction';

/**
 * 삭제된 아이템
 * @param {*} onDelete 목록에서 제거. 북마크만 가능하다
 */
export default function DeletedMyActivityItem({ onDelete }) {
  return (
    <div className={cn(css.myContent, css.isDeleted)}>
      삭제된 글입니다
      {isFunction(onDelete) && (
        <button
          className={css.myContent__cleanDeletedItemButton}
          onClick={onDelete}
        />
      )}
    </div>
  );
}

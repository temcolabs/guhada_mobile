import React, { useState, useEffect } from 'react';
import ArticleTitle from './ArticleTitle';
import ArticleContents from './ArticleContents';
import css from './ArticlePreviewModal.module.scss';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import BoardTitle from '../list/BoardTitle';

export default function ArticlePreviewModal({
  isOpen,
  onClose = () => {},
  title,
  categoryName,
  categoryFilterName,
  commentCount,
  hitCount,
  likeCount,
  userName,
  contents,
}) {
  // 컨텐츠 높이
  const [articleHeight, setArticleHeight] = useState(300);

  // refs
  const [modalWrapEl, setmodalWrapEl] = useState(null);
  const [titleWrapEl, settitleWrapEl] = useState(null);
  const [closeButtonWrapEl, setcloseButtonWrapEl] = useState(null);

  const modalWrapRefCb = el => {
    setmodalWrapEl(el);
  };

  const titleWrapRefCb = el => {
    settitleWrapEl(el);
  };

  const closeButtonWrapRefCb = el => {
    setcloseButtonWrapEl(el);
  };

  useEffect(() => {
    const calcResult =
      parseInt(modalWrapEl?.getBoundingClientRect()?.height) -
      (parseInt(titleWrapEl?.getBoundingClientRect()?.height) +
        parseInt(closeButtonWrapEl?.getBoundingClientRect()?.height)) -
      40; // 버튼 marginTop

    setArticleHeight(calcResult);
  }, [closeButtonWrapEl, modalWrapEl, titleWrapEl]);

  return (
    <ModalWrapper isOpen={isOpen} contentStyle={{}} onClose={onClose}>
      <div className={css.wrap}>
        <div className={css.wrapInner} ref={modalWrapRefCb}>
          <div ref={titleWrapRefCb}>
            <BoardTitle isSortVisible={false}>{categoryName}</BoardTitle>
            <ArticleTitle
              title={title}
              categoryFilterName={categoryFilterName}
              commentCount={commentCount}
              hitCount={hitCount}
              likeCount={likeCount}
              createdTimestamp={+new Date()}
              userName={userName}
            />
          </div>

          {/* 게시글 본문 */}
          <div
            className={css.contentWrap}
            style={{ height: `${articleHeight}px` }}
          >
            <ArticleContents contents={contents} />
          </div>

          <div ref={closeButtonWrapRefCb} className={css.closeButtonWrap}>
            <button className={css.closeButton} onClick={onClose}>
              <span>확인</span>
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}

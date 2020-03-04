import React from 'react';
import jsxTextLineBreak from 'childs/lib/common/jsxTextLineBreak';
import css from './ArticleContents.module.scss';
import { useBBSStore } from 'stores/bbs';
import ArticleImages from './ArticleImages';
import { useObserver } from 'mobx-react-lite';

/**
 *
 * @param {*} contents 본문
 * @param {*} isCreatedOnMobile 모바일에서 작성된 글. HTML이 아니다. 줄바꿈을 직접 해줘야 한다.
 * @param {*} imageList 모바일에서 작성한 글의 첨부파일
 */
export default function ArticleContents({
  // isCreatedOnMobile = false,
  contents = '', // html
  wrapperStyle = {},
}) {
  const { article: articleStore } = useBBSStore();
  const { isCreatedOnMobile } = articleStore;

  return useObserver(() =>
    isCreatedOnMobile ? (
      <div style={wrapperStyle}>
        {/* 모바일 컨텐츠 */}
        <div className={css.articleContents__mobile}>
          {/* 모바일에서 첨부한 이미지 목록 */}
          <ArticleImages />
          <div>{jsxTextLineBreak(contents)}</div>
        </div>
      </div>
    ) : (
      // 데스크탑 컨텐츠
      <div
        className={css.articleContents}
        style={wrapperStyle}
        dangerouslySetInnerHTML={{ __html: `<div>${contents}</div>` }}
      />
    )
  );
}

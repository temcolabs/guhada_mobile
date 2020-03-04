import React, { useEffect } from 'react';
import css from './ArticleContents.module.scss';
import { useBBSStore } from 'stores/bbs';
import loadImage from 'blueimp-load-image';

/**
 * 첨부 이미지 목록
 * loadImage로 이미지를 불러올 때 Exif의 orientation 데이터를 적용해서 이미지를 회전시킨다.
 *
 * NOTE: imageList는 현재 모바일에서 글을 작성하며 이미지를 첨부했을 때만 존재한다.
 *
 * @param {*} imageList 모바일에서 작성한 글의 첨부파일
 */
export default function ArticleImages({ imageList = [], wrapperStyle = {} }) {
  const { article: articleStore } = useBBSStore();
  const listRef = React.useRef(null);

  useEffect(() => {
    const listEl = listRef.current;
    if (listEl) {
      articleStore.bbsImageList.forEach(bbsImage => {
        // NOTE: https://github.com/blueimp/JavaScript-Load-Image#options
        return loadImage(
          bbsImage.url,
          (canvasLoaded, data) => {
            // canvasLoaded.addEventListener('click', e => {
            // });

            // 불러온 이미지를 이미지 추가한다.
            listEl.appendChild(canvasLoaded);
          },
          {
            orientation: true, // Exif에 았는 orientation 정보를 이미지에 적용한다.
            crossOrigin: false,
          }
        );
      });
    }

    return () => {
      if (listEl) {
        // 컨테이너 엘레멘트를 비운다.
        while (listEl.hasChildNodes()) {
          listEl.removeChild(listEl.firstChild);
        }
      }
    };
  }, [articleStore.bbsImageList]);

  return (
    <div className={css.bbsImageList} style={wrapperStyle} ref={listRef} />
  );
}

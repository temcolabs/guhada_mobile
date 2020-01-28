import React from 'react';
import css from './ArticleShareButton.module.scss';
import SlideUpOptions from '../form/SlideUpOptions';
import copy from 'copy-to-clipboard';
import useStores from 'stores/useStores';

const ArticleShareButton = ({ onClick = () => {}, url = 'https://' }) => {
  const { alert } = useStores();

  return (
    <SlideUpOptions
      renderButton={() => {
        return <button className={css.button} />;
      }}
      wrapperStyle={{
        display: 'inline-block',
      }}
      renderSlideArea={({ initialStyle, toggleSlide }) => {
        return (
          <div className={css.shareSlideArea} style={initialStyle}>
            <div className={css.shareSlideArea_title}>공유하기</div>
            <div
              className={css.urlBox}
              onClick={e => {
                e.stopPropagation();
                copy(url);
                alert.showAlert('게시글 주소가 클립보드에 복사되었습니다.');
                toggleSlide();
              }}
            >
              <span className={css.urlBox_copyButton}>복사</span>
              <span className={css.urlBox_url}>{url}</span>
            </div>
          </div>
        );
      }}
      topPosOnEnter="55px"
      topPosOnExit="65px"
    />
  );
};

export default ArticleShareButton;

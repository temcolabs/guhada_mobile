import React, { useEffect } from 'react';
import css from './TempArticleButton.module.scss';
import SlideUpOptions from '../form/SlideUpOptions';
import moment from 'moment';
import { useBBSStore } from 'stores/bbs';
import { observer } from 'mobx-react';

/**
 * 임시저장한 글 표시 버튼
 */
const TempArticleButton = ({
  wrapperStyle = {},
  onClickTempArticle = ({ data }) => {},
  onDeleteTempArticle = id => {},
}) => {
  const { tempArticle } = useBBSStore();

  useEffect(() => {
    tempArticle.getTempArticles();
    return () => {
      tempArticle.emtpyList();
    };
  }, [tempArticle]);

  return (
    <SlideUpOptions
      /* renderButton에 observerble이 있지만 listen을 못해서 key 변경으로 컴포넌트를 리렌더링한다 */
      key={tempArticle.totalElements}
      renderButton={() => {
        return (
          <div className={css.wrap} style={wrapperStyle}>
            <button type="button" className={css.button}>
              <span className={css.button_count}>
                {tempArticle.totalElements}
              </span>
            </button>
          </div>
        );
      }}
      renderSlideArea={({ initialStyle, toggleSlide }) => {
        return (
          <div className={css.slideArea} style={initialStyle}>
            <div className={css.slideAreaHeader}>
              <div
                className={css.slideArea_closeButton}
                onClick={toggleSlide}
              />
              <div className={css.slideArea_title}>임시저장함</div>
            </div>

            {tempArticle.list.map((item, index) => {
              return (
                <div key={index} className={css.tempArticle}>
                  <div
                    className={css.tempArticle_item}
                    onClick={() => {
                      onClickTempArticle({
                        data: item,
                      });
                      toggleSlide();
                    }}
                  >
                    <div className={css.tempArticle_title}>{item.title}</div>
                    <div className={css.tempArticle_savedAt}>
                      <span>
                        {moment(item.createdTimestamp).format('YY.MM.DD HH:mm')}
                      </span>
                      <span>&nbsp;</span>
                      <span>저장됨</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={css.tempArticle_removeButton}
                    onClick={() => {
                      toggleSlide();
                      onDeleteTempArticle(item.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      }}
      topPosOnEnter="0"
      topPosOnExit="50px"
      isOpenEnabled={tempArticle.list.length > 0}
    />
  );
};

export default observer(TempArticleButton);

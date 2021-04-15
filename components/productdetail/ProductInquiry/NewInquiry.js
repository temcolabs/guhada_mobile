import React, { useState, useEffect } from 'react';
import css from './NewInquiry.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { inject } from 'mobx-react';

/**
 * 상품 문의하기 슬라이드인
 */
function NewInquiry({ isVisible, onClose, productdetail }) {
  const [content, setContent] = useState('');
  const [count, setCount] = useState(0);
  useEffect(() => {
    setContent('');
  }, [onClose]);

  useEffect(() => {
    setCount(content.length);
  }, [content]);

  function setContentText(e) {
    content.length <= 1000
      ? setContent(e.target.value)
      : setContent(content.substring(0, 1000));
  }

  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
        <div className={css.wrap}>
          <div className={css.header}>
            <div className={css.backIcon} onClick={onClose} />
            <div className={css.headerText}>상품 문의하기</div>
          </div>
          <div className={css.contentsWrap}>
            <div className={css.textareaWrap}>
              <textarea
                className={css.inquiryText}
                placeholder="문의하실 내용을 입력하세요"
                value={content}
                onChange={(e) => {
                  setContentText(e);
                }}
              />
              <div className={css.textCountWrap}>
                <span>{count}</span>/1000
              </div>
            </div>
            <div className={css.withOutContents}>
              <div className={css.checkboxWrap}>
                <input
                  type="checkbox"
                  id="privateInquiry"
                  onChange={(e) =>
                    e.target.checked === true
                      ? productdetail.setSecretInquiry(true)
                      : productdetail.setSecretInquiry(false)
                  }
                />
                <label htmlFor="privateInquiry">
                  <span />
                  <div>{`비공개글 설정`}</div>
                </label>
              </div>
              <div className={css.subContent}>
                {`문의하신 내용에 대한 답변은 해당 상품의 상세페이지 또는 `}
                <span className={css.colored}>
                  <br />
                  마이페이지 &gt; 상품문의
                </span>
                에서 확인하실 수 있습니다.
              </div>
            </div>
          </div>
          <div className={css.buttonWrap}>
            <button onClick={onClose}>취소</button>
            <button
              className={css.isColored}
              onClick={() => productdetail.setNewInquiry(content, onClose)}
            >
              문의하기
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('productdetail')(NewInquiry);

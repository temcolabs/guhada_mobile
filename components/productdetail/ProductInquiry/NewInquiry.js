import React, { useState } from 'react';
import css from './NewInquiry.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import CheckBox from 'components/common/Checkbox';
import { inject } from 'mobx-react';

function NewInquiry({ isVisible, onClose, productdetail }) {
  const [content, setContent] = useState('');
  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
        <div className={css.wrap}>
          <div className={css.header}>
            <div className={css.backIcon} onClick={onClose} />
            <div className={css.headerText}>상품 문의하기</div>
          </div>
          <div className={css.contentsWrap}>
            <textarea
              className={css.inquiryText}
              placeholder="문의하실 내용을 입력하세요"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <div className={css.checkboxWrap}>
              <input
                type="checkbox"
                id="privateInquiry"
                onChange={e =>
                  e.target.checked === true
                    ? productdetail.setSecretInquiry(true)
                    : productdetail.setSecretInquiry(false)
                }
              />
              <label htmlFor="privateInquiry">
                <span />
                {`비공개글 설정`}
              </label>
            </div>
            <div className={css.subContent}>
              문의하신 내용에 대한 답변은 해당 상품의 상세페이지 또는
              <span className={css.colored}>마이페이지 > 상품문의</span>에서
              확인하실 수 있습니다.
            </div>
          </div>
          <div className={css.buttonWrap}>
            <button onClick={onClose}>취소</button>
            <button
              className={css.isColored}
              onClick={() => productdetail.setNewInquiry(content, onClose)}
            >
              등록
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('productdetail')(NewInquiry);

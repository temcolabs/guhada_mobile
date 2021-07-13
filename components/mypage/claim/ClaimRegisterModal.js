import { useState, useEffect } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { inject } from 'mobx-react';
import API from 'lib/API';
import isTruthy from 'lib/common/isTruthy';
import _ from 'lodash';
/**
 * 상품 문의 등록하기 모달
 */
function ClaimRegisterModal({
  mypageInquiry,
  dealsId, // 판매 상품 정보
  isModalOpen = false,
  onCloseModal = () => {},
}) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [content, setContent] = useState('');
  const [deals, setDeals] = useState({});

  useEffect(() => {
    if (isTruthy(dealsId)) {
      // dealsId 가 변경되었으므로 작성 내용도 초기화한다
      setIsPrivate(false);
      setContent('');

      API.product
        .get(`/deals/${dealsId}`)
        .then(({ data }) => {
          setDeals(data.data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [dealsId]);

  return (
    <ModalWrapper
      isOpen={isModalOpen}
      onRequestClose={onCloseModal}
      contentLabel="product inquiry"
    >
      <div className="productInquiry__modal">
        <div className="productInquiry__modal-header">
          <div>상품 문의하기</div>
          <img
            src="/public/icon/modal_close.png"
            width={29}
            height={29}
            onClick={onCloseModal}
          />
        </div>
        <div>
          <textarea
            className="productInquiry__modal-textarea"
            placeholder="문의하실 내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="productInquiry__modal-checkBoxWrap">
          <div className="productInquiry__checkbox productInquiry__modal-checkbox">
            <input
              type="checkbox"
              id="askproduct"
              value={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <label htmlFor="askproduct">
              <span>비공개글 설정</span>
            </label>
          </div>
          <div className="productInquiry__modal-textCount">
            <span>{_size(content)}</span>/1000
          </div>
        </div>
        <div className="productInquiry__modal-contents">
          문의하신 내용에 대한 답변은 해당 상품의 상세페이지 또는
          <span>{` `}마이페이지 > 상품문의</span>에서 확인하실 수 있습니다.
        </div>
        <div className="productInquiry__modal-btnwrap">
          <button onClick={onCloseModal}>취소</button>
          <button
            onClick={() =>
              mypageInquiry.registerInquiry({
                dealsId,
                productId: deals.productId,
                content,
                isPrivate: isPrivate,
                onSuccess: onCloseModal,
              })
            }
          >
            등록
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default inject('mypageInquiry')(ClaimRegisterModal);

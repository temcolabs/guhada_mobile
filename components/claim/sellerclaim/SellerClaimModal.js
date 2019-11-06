import React, { useState, useEffect, useRef } from 'react';
import css from './SellerClaimModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import MyDealSelect from './MyDealSelect';
import ClaimType from './ClaimType';
import { inject } from 'mobx-react';

function SellerClaimModal({ isVisible, sellerId, sellerClaim, onClose }) {
  const [claim, setClaim] = useState('');
  const [groupId, setGroupId] = useState(0);
  const [attachImage, setAttachImage] = useState([]);

  const attachFileInputRef = useRef();

  function setClaimText(e) {
    claim.length <= 1000
      ? setClaim(e.target.value)
      : setClaim(claim.substring(0, 1000));
  }

  function setAttachImageArray(data) {
    setAttachImage([
      ...attachImage,
      {
        url: data,
      },
    ]);
  }

  function deleteAttachImageArray(url, index) {
    const arr = attachImage;
    arr.splice(index, 1);
    setAttachImage([...arr]);
    sellerClaim.deleteImage(url);
  }

  useEffect(() => {
    console.log(attachImage, 'attachImageattachImage');
  }, [attachImage]);

  useEffect(() => {
    console.log(groupId, 'groupIdgroupId');
  }, [groupId]);
  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isVisible}>
        <div className={css.wrap}>
          <div className={css.header}>
            <div className={css.backIcon} onClick={onClose} />
            <div className={css.headerText}>판매자 문의하기</div>
          </div>
          <div className={css.contentsWrap}>
            <div className={css.dealOptions}>
              <MyDealSelect />
            </div>
            {true ? null : (
              <div className={css.errorMessage}>이 값은 필수 입니다.</div>
            )}

            <div className={css.claimType}>
              <ClaimType />
            </div>
            <div className={css.textArea}>
              <textarea
                placeholder="문의하실 내용을 입력하세요"
                onChange={e => {
                  setClaimText(e);
                }}
                maxLength="1000"
              />
            </div>
            <div className={css.textNumberChecker}>
              <span>{claim.length}</span>
              /1000
            </div>

            <div className={css.attachmentFile}>
              <button
                className={css.fileAttachment__photoButton}
                onClick={() => {
                  attachFileInputRef.current.click();
                }}
                type="button"
              >
                첨부파일
              </button>

              <input
                style={{ display: 'none' }}
                type="file"
                ref={attachFileInputRef}
                onChange={e => {
                  sellerClaim.uploadImage(e, setAttachImageArray);
                }}
              />
            </div>
            {attachImage.length > 0 ? (
              <div className={css.attachImageWrap}>
                {attachImage.map((data, index) => {
                  return (
                    <div
                      className={css.attachImage}
                      style={{ backgroundImage: `url(${data.url})` }}
                      key={index}
                    >
                      <div
                        className={css.attachImageDelete}
                        onClick={() => {
                          deleteAttachImageArray(data.url, index);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className={css.notify}>
              구매한 상품이 없을 경우, 상품 문의를 통하여 문의가 가능합니다.
              문의 내용에 대한 답변은 <span>마이페이지 > 문의</span> 에서
              확인하실 수 있습니다.
            </div>
          </div>

          <div className={css.buttonGroup}>
            <div className={css.cancelBtn}>취소</div>
            <div
              className={css.inquiryBtn}
              onClick={() => {
                sellerClaim.createSellerClaim(claim, attachImage, sellerId);
              }}
            >
              문의하기
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
export default inject('sellerClaim')(SellerClaimModal);

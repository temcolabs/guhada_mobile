import { useState, useCallback, useMemo } from 'react';
import css from './ClaimItem.module.scss';
import cn from 'classnames';
import moment from 'moment';
import { dateFormat } from 'lib/constant';
import inquiryStatus from 'lib/constant/inquiry/inquiryStatus';
import { pushRoute } from 'lib/router';
import isTruthy from 'lib/common/isTruthy';

function ClaimItem({
  inquiry = {
    createdAt: '',
    enable: '',
    id: 0,
    inquirer: 0,
    inquiry: '',
    nickname: '',
    private: '',
    productId: 0,
    replier: '',
    reply: '',
    replyAt: '',
    replyUpdated: '',
    status: '',
    updatedAt: '',
  },
  product = {
    brandId: 0,
    brandName: '',
    dealId: 0,
    dealName: '',
    discountPrice: 0,
    discountRate: 0,
    imageName: '',
    imageUrl: '',
    options: [],
    productId: 0,
    productName: '',
    productSeason: '',
    sellPrice: 0,
    sellerId: 0,
    sellerName: '',
    shipExpenseType: '',
    totalStock: 0,
  },
  handleModifyModal = () => {},
  handleDeleteModalOpen = () => {},
}) {
  const [isFolded, setFold] = useState(true);

  const toggleIsFolded = useCallback(() => {
    setFold((status) => !status);
  }, []);

  const isAnswered = useMemo(() => inquiry.status === inquiryStatus.COMPLETED, [
    inquiry.status,
  ]);

  const handleClickAnswer = useCallback(() => {
    if (isAnswered) {
      toggleIsFolded();
    }
  }, [isAnswered, toggleIsFolded]);

  return (
    <div className={css.wrap}>
      <div className={css.productWrap}>
        {isTruthy(product?.imageUrl) ? (
          <div
            className={css.productImageBox}
            style={{ backgroundImage: `url(${product.imageUrl})` }}
            onClick={() => pushRoute(`/productdetail?deals=${product.dealId}`)}
          />
        ) : null}
        <div className={css.productInfo}>
          <div className={css.brandName}>{product?.brandName}</div>
          <div className={css.prodName}>
            {product?.season ? product?.season + ' ' : ''}
            {product?.productName}
          </div>
          <div className={css.option}>{product?.sellerName}</div>
          <div className={css.shipping}>
            {moment(inquiry.updatedAt).format(dateFormat.YYYYMMDD_UI)}
          </div>
        </div>

        {/* 삭제 버튼 */}
        <button
          className={css.deleteButton}
          onClick={() => handleDeleteModalOpen(inquiry)}
        />
      </div>

      {inquiry?.status === inquiryStatus.PENDING ? (
        <button
          className={css.modifyButton}
          onClick={() => handleModifyModal(inquiry)}
        >
          문의수정
        </button>
      ) : null}

      <div
        className={cn(css.answerWrap, { [css.isExpanded]: !isFolded })}
        onClick={handleClickAnswer}
      >
        <div
          className={cn(css.answerInner, {
            [css.isFolded]: isFolded,
          })}
        >
          <div
            className={cn(css.answerStatus, {
              [css.isAnswered]: isAnswered,
            })}
          >
            {isAnswered ? '답변완료' : '미답변'}
          </div>

          <div
            className={cn(css.inquiry, {
              [css.isFolded]: isFolded,
              [css.isFolderble]: isAnswered,
            })}
          >
            <div className={css.inquiry_text}>{inquiry?.inquiry}</div>

            <div className={cn(css.reply, { [css.isHidden]: isFolded })}>
              <div className={css.replay__indent}>답변</div>
              <div className={css.replay__contents}>
                <div className={css.reply__text}>{inquiry?.reply || ' '}</div>
                <div className={css.inquiry__info}>
                  <span>판매자</span>
                  <span>
                    {moment(inquiry?.updatedAt).format(dateFormat.YYYYMMDD_UI)}
                  </span>
                  <span>
                    {moment(inquiry?.updatedAt).format(dateFormat.HHMM)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimItem;

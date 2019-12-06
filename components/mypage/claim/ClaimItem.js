import React, { useState } from 'react';
import css from './ClaimItem.module.scss';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';
import _ from 'lodash';
import { pushRoute } from 'childs/lib/router';

function ClaimItem({
  content = {
    inquiry: {
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
    item: {
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
  },
  handleModifyModal = () => {},
  handleDeleteModalOpen = () => {},
}) {
  const [replyId, setReplyId] = useState('');
  const [fold, setFold] = useState(false);
  return (
    <div className={css.itemWrap}>
      <div className={css.productWrap}>
        {content.item?.imageUrl !== null ? (
          <div
            className={css.productImageBox}
            style={{ backgroundImage: `url(${content.item?.imageUrl})` }}
            onClick={() =>
              pushRoute(`/productdetail?deals=${content.item.dealId}`)
            }
          />
        ) : null}
        <div className={css.productInfo}>
          <div className={css.brandName}>{content.item?.brandName}</div>
          <div className={css.prodName}>
            <span>
              {content.item?.productSeason ? content.item?.productSeason : ''}
            </span>
            <span>{` ` + content.item?.dealName}</span>
          </div>
          <div className={css.nickName}>{content.item?.sellerName}</div>
          <div className={css.writing}>
            {moment(content.inquiry?.createdAt).format(dateFormat.YYYYMMDD_UI)}
            {` `}
            {moment(content.inquiry?.createdAt).format(dateFormat.HHMM)}
            {` 작성`}
          </div>
        </div>
        {content.inquiry?.status === 'PENDING' ? (
          <div className={css.actionBox}>
            <button
              className={css.isColored}
              onClick={() => handleModifyModal(content.inquiry)}
            >
              문의수정
            </button>
            <button onClick={() => handleDeleteModalOpen(content.inquiry)}>
              삭제
            </button>
          </div>
        ) : null}
      </div>
      <div
        className={css.answerWrap}
        onClick={() => {
          content.inquiry?.status === 'COMPLETED' && setReplyId(replyId);
          setFold(!fold);
        }}
        style={{
          display:
            content.inquiry?.status === 'COMPLETED' && fold ? 'none' : 'block',
          backgroundColor: fold ? '#f9f9fa' : '#ffffff',
        }}
      >
        {content.inquiry?.status === 'PENDING' ? (
          <div className={css.statusBox}>미답변</div>
        ) : (
          <div className={css.statusBox__true}>답변완료</div>
        )}

        <div
          className={css.answerText}
          style={{ whiteSpace: fold ? 'unset' : 'nowrap' }}
        >
          {content.inquiry?.inquiry}
        </div>
      </div>
      {_.isNil(content.inquiry?.reply) === false && (
        <div
          className={css.replyDivWrap}
          style={{
            display: fold === true ? 'block' : 'none',
          }}
          onClick={() => {
            setFold(!fold);
          }}
        >
          <div className={css.replyAnswerWrap}>
            <div className={css.statusBox__true}>답변완료</div>
            <div className={css.answerText}>{content.inquiry?.inquiry}</div>
          </div>
          <div className={css.replyWrap}>
            <b>답변</b>
            <div className={css.replyTextWrap}>
              {content.inquiry?.reply}
              <div className={css.writing}>
                {`판매자 `}
                <span>
                  {moment(content.inquiry?.replyAt).format(
                    dateFormat.YYYYMMDD_UI
                  )}
                  {` `}
                  {moment(content.inquiry?.replyAt).format(dateFormat.HHMM)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClaimItem;

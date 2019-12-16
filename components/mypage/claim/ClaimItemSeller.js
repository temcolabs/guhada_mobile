import React, { useState } from 'react';
import css from './ClaimItem.module.scss';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';
import _ from 'lodash';

function ClaimItemSeller({
  content = {
    brandName: 'GUCCI',
    contents: '배송언제 도착하나융',
    createdAt: 1569412657000,
    id: 3,
    nickname: 'Anna',
    productImageUrl:
      'https://d15jp4iwerkqw1.cloudfront.net/images/deals/6fa63684ea7e418aa1fc986f0e4484a6',
    productName: '구찌 가방',
    repliedAt: null,
    reply: null,
    season: null,
    type: '배송',
  },
  handleModifyModal = (sellerClaim = {}) => {},
  handleDeleteModalOpen = (sellerClaim = {}) => {},
}) {
  const [replyId, setReplyId] = useState('');
  const [isFolded, setFolded] = useState(false);

  const hasAnswer = !_.isNil(content.reply);

  return (
    <div className={css.itemWrap}>
      <div className={css.productWrap}>
        {content?.productImageUrl && (
          <div
            className={css.productImageBox}
            style={{ backgroundImage: `url(${content?.productImageUrl})` }}
          />
        )}
        <div className={css.productInfo}>
          <div className={css.brandName}>{content?.brandName}</div>
          <div className={css.prodName}>
            <span>{content?.season ? content?.season : ''}</span>
            <span>{` ` + content?.productName}</span>
          </div>

          {content?.nickname && (
            <div className={css.nickName}>{content?.nickname}</div>
          )}

          <div className={css.writing}>
            {moment(content?.createdAt).format(dateFormat.YYYYMMDD_UI)}
            {` `}
            {moment(content?.createdAt).format(dateFormat.HHMM)}
            {` 작성`}
          </div>
        </div>

        {/* 문의 수정 & 삭제 버튼 */}
        {/* {!hasAnswer && ( */}
        {// TODO: 판매자 문의 API 필터 파라미터 추가 후 작업
        false && (
          <div className={css.actionBox}>
            <button
              className={css.isColored}
              onClick={() => handleModifyModal(content)}
            >
              문의수정
            </button>
            <button onClick={() => handleDeleteModalOpen(content)}>삭제</button>
          </div>
        )}
      </div>

      {/* 답변 박스 */}
      <div
        className={css.answerWrap}
        onClick={() => {
          hasAnswer && setReplyId(replyId);
          setFolded(!isFolded);
        }}
        style={{
          display: hasAnswer && isFolded ? 'none' : 'block',
          backgroundColor: isFolded ? '#f9f9fa' : '#ffffff',
        }}
      >
        {!hasAnswer ? (
          <div className={css.statusBox}>미답변</div>
        ) : (
          <div className={css.statusBox__true}>답변완료</div>
        )}

        <div
          className={css.answerText}
          style={{ whiteSpace: isFolded ? 'unset' : 'nowrap' }}
        >
          {content?.contents}
        </div>
      </div>

      {!_.isNil(content?.reply) && (
        <div
          className={css.replyDivWrap}
          style={{
            display: isFolded === true ? 'block' : 'none',
          }}
          onClick={() => {
            setFolded(!isFolded);
          }}
        >
          <div className={css.replyAnswerWrap}>
            <div className={css.statusBox__true}>답변완료</div>
            <div className={css.answerText}>{content?.contents}</div>
          </div>
          <div className={css.replyWrap}>
            <b>답변</b>
            <div className={css.replyTextWrap}>
              {content?.reply}
              <div className={css.writing}>
                {`판매자`}
                <span>
                  {moment(content?.replyAt).format(dateFormat.YYYYMMDD_UI)}
                  {` `}
                  {moment(content?.replyAt).format(dateFormat.HHMM)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClaimItemSeller;

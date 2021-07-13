import { useState, useCallback, useMemo } from 'react';
import css from './ClaimItem.module.scss';
import moment from 'moment';
import { dateFormat } from 'lib/constant';
import cn from 'classnames';

function ClaimItemSeller({
  claim = {
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
  const [isFolded, setFold] = useState(true);

  const toggleIsFolded = useCallback(() => {
    setFold((status) => !status);
  }, []);

  const isAnswered = useMemo(() => !!claim.reply, [claim.reply]);

  const handleClickAnswer = useCallback(() => {
    if (isAnswered) {
      toggleIsFolded();
    }
  }, [isAnswered, toggleIsFolded]);

  return (
    <div className={css.wrap}>
      <div className={css.productWrap}>
        <div
          className={css.productImageBox}
          style={{ backgroundImage: `url(${claim.productImageUrl})` }}

          // NOTE: dealId 없음
          // onClick={() => pushRoute(`/productdetail?deals=${product.dealId}`)}
        />
        <div className={css.productInfo}>
          <div className={css.brandName}>{claim.brandName}</div>
          <div className={css.prodName}>
            {claim.season ? claim.season + ' ' : ''}
            {claim.productName}
          </div>
          <div className={css.option}>{claim.sellerName}</div>
          <div className={css.shipping}>
            {moment(claim.updatedAt).format(dateFormat.YYYYMMDD_UI)}
          </div>
        </div>

        {/* 삭제 버튼 */}
        <button
          className={css.deleteButton}
          onClick={() => handleDeleteModalOpen(claim)}
        />
      </div>

      {/* TODO: 판매자 문의 수정 */}
      {/* {!isAnswered && (
        <button
          className={css.modifyButton}
          onClick={() => handleModifyModal(claim)}
        >
          문의수정
        </button>
      )} */}

      <div
        className={cn(css.answerWrap, { [css.isExpanded]: !isFolded })}
        onClick={handleClickAnswer}
      >
        <div
          className={cn(css.answerInner, {
            [css.isFolded]: isFolded,
            [css.isFolderble]: isAnswered,
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
            <div className={css.inquiry_text}>{claim?.contents}</div>

            <div className={cn(css.reply, { [css.isHidden]: isFolded })}>
              <div className={css.replay__indent}>답변</div>
              <div className={css.replay__contents}>
                <div className={css.reply__text}>{claim?.reply || ' '}</div>
                <div className={css.inquiry__info}>
                  <span>판매자</span>
                  <span>
                    {moment(claim?.repliedAt).format(dateFormat.YYYYMMDD_UI)}
                  </span>
                  <span>
                    {moment(claim?.repliedAt).format(dateFormat.HHMM)}
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

export default ClaimItemSeller;

import React from 'react';
import css from './ReviewWriteItem.module.scss';
import addCommaToNum from 'lib/common/addCommaToNum';
import moment from 'moment';
import { dateFormat } from 'lib/constant';
import { pushRoute } from 'lib/router';
import API from 'lib/API';

export default function ReviewWriteItem({
  orderItem = {
    //  주문 데이터 객체
    brandName: '', // 브랜드명 ,
    discountPrice: 0, // 할인된 가격 ,
    expireDate: '', // 무통장 입금시 입금기한(무통장이 아니면경우 null) ,
    imageName: '', // 대표 이미지 파일명 ,
    imageUrl: '', // 대표 이미지 URL ,
    optionAttribute1: '', // 첫번째 옵션 ,
    optionAttribute2: '', // 두번째 옵션 ,
    optionAttribute3: '', // 세번째 옵션 ,
    orderDate: '', // 주문일 ,
    orderPrice: 0, // 주문한 금액 ,
    originalPrice: 0, // 원래 가격 ,
    prodName: '', // 상품명 ,
    purchaseId: 0, // 구매 데이터의 아이디 ,
    purchaseStatus: '', //
    purchaseStatusText: '', // 주문의 상태값 ,
    quantity: 0, // 구매수량 ,
    season: '', // 시즌 ,
    sellerId: 0, // 판매자의 아이디 ,
    sellerName: '', // 판매자의 이름 ,
    shipPrice: 0, // 배송비 ,
    statusMessage: '', // 상태의 따른 메세지,
    orderProdGroupId: 0, // 리뷰 작성을 위한 아이디
    orderProdId: 0,
  },
  onClickReviewButton = () => {},
  onSearch,
}) {
  const item = orderItem;

  const currencyUnit = '원';
  const eaUnit = '개';

  const handleBrandNameClick = async () => {
    const { data } = await API.product.get(`/products/${orderItem.productId}`);
    const productData = data.data;
    if (productData) {
      onSearch({
        brand: productData.brandId,
        enter: 'brand',
      });
    }
  };

  return (
    <div className={css.itemWrap}>
      <div
        className={css.productImageBox}
        style={{ backgroundImage: `url(${item.imageUrl})` }}
        onClick={() => pushRoute(`productdetail?deals=${item.dealId}`)}
      />
      <div className={css.productInfo}>
        <div className={css.brandName} onClick={handleBrandNameClick}>
          {item.brandName}
        </div>
        <div
          className={css.prodName}
          onClick={() => pushRoute(`productdetail?deals=${item.dealId}`)}
        >
          <span>{item.season ? item.season : ''} </span>
          <span>{` ` + item.prodName}</span>
        </div>
        <div className={css.option}>
          {item.optionAttribute1} {item.optionAttribute2}
          {item.optionAttribute3} {`${item.quantity}${eaUnit}`}
        </div>
        <div className={css.price}>
          {addCommaToNum(item.originalPrice)}
          {currencyUnit}
        </div>
        <div className={css.shipping}>
          {moment(item.orderTimestamp || item.orderDate).format(
            dateFormat.YYYYMMDD_UI
          )}
          {` `}
          {item.purchaseStatusText}
        </div>
      </div>
      <div className={css.actionBox}>
        <button
          className={css.isColored}
          onClick={() => onClickReviewButton(item)}
        >
          리뷰작성
        </button>
      </div>
    </div>
  );
}

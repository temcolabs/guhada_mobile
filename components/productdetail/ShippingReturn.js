import React from 'react';
import css from './ProductTable.module.scss';
import cn from 'classnames';
import _ from 'lodash';
import checkNullAndEmpty from 'lib/common/checkNullAndEmpty';

// type PolicyKey = 'return' | 'exchange'
const getPolicyHelper = (deals, policyKey) => {
  const { shipping } = deals;
  if (!shipping) return '';

  if (shipping[`${policyKey}ShipExpense`] === 0) {
    if (
      typeof shipping[`${policyKey}Policy`] === 'string' &&
      shipping[`${policyKey}Policy`].length
    ) {
      return `(${shipping[`${policyKey}Policy`]})`;
    } else if (shipping.claimShipExpenseType === 'PAID') {
      return policyKey === 'return' ? '(반품 불가)' : '(교환 불가)';
    }
  } else {
    if (
      typeof shipping[`${policyKey}Policy`] === 'string' &&
      shipping[`${policyKey}Policy`].length
    ) {
      return `${shipping[`${policyKey}ShipExpense`].toLocaleString()}원 (${
        shipping[`${policyKey}Policy`]
      })`;
    }
    return `${shipping[`${policyKey}ShipExpense`].toLocaleString()}원`;
  }
  return '무료';
};

export default function ShippingReturn({
  deals = [
    {
      shipExpenseType: '',
      shipping: {
        claimAddressId: 0,
        claimShipCompanyName: '',
        exchangeShipExpense: 0,
        isBundleAvailable: true,
        isIsolatedAreaAvailable: true,
        isQuickAvailable: false,
        returnShipExpense: 0,
        shipExpense: 0,
        shipExpenseType: '',
      },
      asInfo: '',
      asTelephone: '',
    },
  ],
  claims = [
    {
      address: '',
      createdAt: '',
      defaultAddress: true,
      detailAddress: '',
      id: 0,
      name: '',
      roadAddress: '',
      sellerAddressType: '',
      sellerUserId: 0,
      telephone: '',
      zip: '',
    },
  ],
  businessSeller = [
    {
      companyName: '',
      representativeName: '',
      corporationRegistrationNumber: '',
      mailorderRegistrationNumber: '',
      zip: '',
      roadAddress: '',
      detailAddress: '',
    },
  ],
  seller = [{ claimTelephone: '0212345678' }],
  shipExpenseType = '',
  sellerStore = {
    badSatisfactionCount: 0,
    businessHours: null,
    claimTelephone: '',
    companyRegistrationNumber: '',
    followed: Boolean,
    followerCount: 0,
    goodSatisfactionCount: 0,
    mailorderRegistrationNumber: '',
    nickname: '',
    normalSatisfactionCount: 0,
    offlineStoreAddress: '',
    representativeName: '',
    sellingCount: 0,
    storeIntroduction: '',
    storeIntroductionDetail: null,
    zip: '',
  },
}) {
  const asInfo = _.isNil(deals.asInfo);
  const asDesc = _.isNil(deals.asDesc);
  const asValueHandle = asInfo !== false && asDesc !== false;

  return (
    <>
      <div className={css.subHeader}>배송정보</div>
      <table className={cn(css.wrap, css.noMargin)}>
        <tbody>
          <tr>
            <th>배송방법</th>
            <td>{`택배, 등기, 소포`}</td>
          </tr>
        </tbody>
      </table>
      {asValueHandle === false && (
        <>
          <div className={css.subHeader}>AS안내사항</div>
          <table className={cn(css.wrap, css.noMargin)}>
            <tbody>
              {asInfo === false && (
                <tr>
                  <th>AS 안내내용</th>
                  <td>{deals.asInfo}</td>
                </tr>
              )}

              {asDesc === false && (
                <tr>
                  <th>판매자 특이사항</th>
                  <td>{deals.asDesc}</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
      <div className={css.subHeader}>교환/반품 안내</div>
      <div className={css.subText}>
        교환/반품 시 먼저 판매자와 연락하셔서 교환/반품사유, 택배사, 반품 지
        주소 등을 협의하신 후 교환/반품 상품을 발송해 주시기 바랍니다.
      </div>
      <table className={cn(css.wrap, css.noMargin)}>
        <tbody>
          <tr>
            <th>반품배송비</th>
            <td>{getPolicyHelper(deals, 'return')}</td>
          </tr>
          <tr>
            <th>교환배송비</th>
            <td>{getPolicyHelper(deals, 'exchange')}</td>
          </tr>
          <tr>
            <th>보내실 곳</th>
            <td>
              {`(우 : ${claims.zip})`}
              <br />
              {claims.roadAddress} {claims.detailAddress}
            </td>
          </tr>
        </tbody>
      </table>
      <div className={css.returnSubHeader}>
        - 반품/교환 사유에 따른 요청 가능 기간
        <div className={css.returnSubText}>
          · 구매자 단순변심은 상품 수령 후 7일 이내 (구매자 반품배송비 부담)
        </div>
      </div>
      <div className={css.returnSubText}>
        · 표시/광고와 상이, 상품하자의 경우 상품 수령 후 3개월 이내 혹은 표
        시/광고와 다른 사실을 안 날로부터 30일 이내 (판매자 반품 배송비 부담) 둘
        중 하나 경과 시 반품/교환 불가
      </div>
      <div className={css.returnSubHeader}>- 반품/교환 불가능 사유</div>
      <div className={cn(css.returnSubText, css.number)}>
        <div className={css.numberWrap}>
          <div className={css.numberItem}>1.</div>
          <div>반품요청기간이 지난 경우</div>
        </div>
        <div className={css.numberWrap}>
          <div className={css.numberItem}>2.</div>
          <div>
            구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우 (단,
            상품의 내용을 확인하기 위하여 포장 등을 훼손한 경우는 제외)
          </div>
        </div>
        <div className={css.numberWrap}>
          <div className={css.numberItem}>3.</div>
          <div>
            포장을 개봉하였으나 포장이 훼손되어 상품가치가 현저히 상실된 경우
            (예: 화장품, 향수류 등)
          </div>
        </div>
        <div className={css.numberWrap}>
          <div className={css.numberItem}>4.</div>
          <div>
            구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한
            경우, (라벨이 떨어진 의류 또는 태그가 떨어진 상품인 경우)
          </div>
        </div>
        <div className={css.numberWrap}>
          <div className={css.numberItem}>5.</div>
          <div>
            시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히
            감소한 경우
          </div>
        </div>
        <div className={css.numberWrap}>
          <div className={css.numberItem}>6.</div>
          <div>
            고객주문 확인 후 상품제작에 들어가는 주문제작상품 (판매자에 게
            회복불가능한 손해가 예상되고, 그러한 예정으로 청약철회권 행사가
            불가하다는 사실을 서면 동의받은 경우)
          </div>
        </div>
      </div>

      {/* 판매자정보 */}
      <div className={css.subHeader}>판매자 정보</div>
      <table className={cn(css.wrap, css.noMargin)}>
        <tbody>
          {checkNullAndEmpty(businessSeller.companyName) === false && (
            <tr>
              <th>상호명</th>
              <td>{businessSeller.companyName}</td>
            </tr>
          )}
          {checkNullAndEmpty(sellerStore.representativeName) === false && (
            <tr>
              <th>대표자</th>
              <td>{sellerStore.representativeName}</td>
            </tr>
          )}
          {checkNullAndEmpty(sellerStore.companyRegistrationNumber) ===
            false && (
            <tr>
              <th>사업자등록번호</th>
              <td>{sellerStore.companyRegistrationNumber}</td>
            </tr>
          )}
          {checkNullAndEmpty(sellerStore.mailorderRegistrationNumber) ===
            false && (
            <tr>
              <th>통신판매업번호</th>
              <td>{sellerStore.mailorderRegistrationNumber}</td>
            </tr>
          )}
          {checkNullAndEmpty(sellerStore.offlineStoreAddress) === false && (
            <tr>
              <th>사업장소재지</th>
              <td>
                {checkNullAndEmpty(sellerStore.zip) === false && (
                  <>
                    {`(우 : ${sellerStore.zip})`}
                    <br />
                  </>
                )}
                {sellerStore.offlineStoreAddress}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

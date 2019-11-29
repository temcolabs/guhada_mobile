import React from 'react';
import css from './SellerClaimModal.module.scss';
import { dateFormat } from 'childs/lib/constant';
import moment from 'moment';

/**
 * react-select 커스텀 옵션
 * SellerClaimModal에서 사용함
 *
 * https://react-select.com/components#replacing-components
 *
 * @param data { label: string, value: any}
 */
export default function DealsOption({ innerProps, data, ...rest }) {
  const { value } = data;

  return (
    <div {...innerProps} className={css.dealsOption}>
      <div className={css.dealsOption__inner}>
        <div
          className={css.dealsOption__image}
          style={{ backgroundImage: `url('${value.imageUrl}')` }}
        />
        <div className={css.dealOptionDesc}>
          <div className={css.dealOptionDesc__title}>
            <span>{value.brandName}</span>
            {value.productName}
          </div>
          <div className={css.dealOptionDesc__option}>
            {!!value.optionAttribute1 && <span>{value.optionAttribute1}</span>}
            {!!value.optionAttribute2 && <span>{value.optionAttribute2}</span>}
            {!!value.optionAttribute3 && <span>{value.optionAttribute3}</span>}
            {!!value.quantity && <span>{`${value.quantity}개`}</span>}
          </div>
          <div className={css.dealOptionDesc__date}>
            {moment(value.orderTimestamp).format(dateFormat.YYYYMMDD_UI)}
            <span>{value.purchaseStatusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

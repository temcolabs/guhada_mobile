import React from 'react';
import css from './ProductTable.module.scss';
import checkNullAndEmpty from 'lib/checkNullAndEmpty';
export default function ProductInfo({
  deals = [
    {
      productStatus: '',
      productNumber: '',
      productOriginType: '',
      filters: [{ label: '', value: '' }],
    },
  ],
}) {
  return (
    <>
      <table className={css.wrap}>
        <tbody>
          {checkNullAndEmpty(deals.productStatusName) === false && (
            <tr>
              <th>상품상태</th>
              <td>{deals.productStatusName}</td>
            </tr>
          )}
          {checkNullAndEmpty(deals.dealId) === false && (
            <tr>
              <th>상품번호</th>
              <td>{deals.dealId}</td>
            </tr>
          )}
          {checkNullAndEmpty(deals.modelNumber) === false && (
            <tr>
              <th>제품번호</th>
              <td>{deals.modelNumber}</td>
            </tr>
          )}
          {checkNullAndEmpty(deals.originAreaName) === false && (
            <tr>
              <th>원산지</th>
              <td>{deals.originAreaName}</td>
            </tr>
          )}
        </tbody>
      </table>
      <table className={css.wrap}>
        <tbody>
          {deals.filters.length > 0
            ? deals.filters.map((filter, index) => {
                return (
                  <tr key={index}>
                    <th>{filter.label}</th>
                    <td>{filter.value}</td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </>
  );
}

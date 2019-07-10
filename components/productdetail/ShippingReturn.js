import React from 'react';
import css from './ProductTable.module.scss';

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
    },
  ],
}) {
  return (
    <>
      <table className={css.wrap}>
        <div className={css.subHeader}>배송정보</div>
        <tbody>
          <tr>
            <th>배송방법</th>
            <td>{deals.shipExpenseType}</td>
          </tr>
          <tr>
            <th>묶음배송여부</th>
            <td>{deals.shipping.isBundleAvailable ? '가능' : '불가능'}</td>
          </tr>
          <tr>
            <th>도서산간배송 여부</th>
            <td>
              {deals.shipping.isIsolatedAreaAvailable ? '가능' : '불가능'}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

import React from 'react';
import css from './ProductTable.module.scss';
import cn from 'classnames';

export default function ProductNotifie({
  productNotifies = [{ label: '색상', value: '상품상세참조' }],
}) {
  return (
    <table className={cn(css.wrap)}>
      <tbody>
        {productNotifies.map((notify, index) => {
          return (
            <tr key={index}>
              <th>{notify.label}</th>
              <td>{notify.value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

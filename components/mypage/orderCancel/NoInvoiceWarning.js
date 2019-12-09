import React from 'react';
import css from './NoInvoiceWarning.module.scss';

export default function NoInvoiceWarning() {
  return (
    <div className={css.wrap}>
      송장번호 미입력시 교환 처리가 늦어질 수 있습니다.
    </div>
  );
}

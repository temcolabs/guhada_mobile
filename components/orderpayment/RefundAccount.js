import React, { useState, useReducer } from 'react';
import { inject, observer } from 'mobx-react';
import css from './RefundAccount.module.scss';
import _ from 'lodash';
import { useObservable } from 'mobx-react-lite';
import RefundAccountBankSelect from './RefundAccountBankSelect';

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

const RefundAccount = ({ orderpayment }) => {
  const [state, dispatch] = useReducer(reducer, {
    name: '',
  });
  const { bankAccount, bankHolder } = state;
  const setAccountInfo = e => {
    dispatch(e.target);
  };

  const [bankName, setBankName] = useState();
  const [isValidatingTried, setIsValidatingTried] = useState(true);

  const bankNameSelect = name => {
    setBankName(name);
    // console.log('set bankname');
  };
  const verifyAccount = () => {
    if (
      !bankName ||
      !bankAccount ||
      !bankHolder ||
      bankName === '' ||
      bankAccount === '' ||
      bankHolder === ''
    ) {
      setIsValidatingTried(false);
    } else {
      setIsValidatingTried(true);
      orderpayment.accountCheck(bankName, bankAccount, bankHolder);
    }

    // console.log(
    //   bankName,
    //   bankAccount,
    //   bankHolder,
    //   isValidatingTried,
    //   'bankName , bankAccount , bankHolder'
    // );
  };

  return (
    <div className={css.wrap}>
      <div className={css.title}>환불 계좌정보</div>

      <div className={css.refundInfoWrap}>
        <div className={css.refundInfoTitle}>은행명</div>
        <div className={css.refundInfo}>
          <RefundAccountBankSelect bankNameSelect={bankNameSelect} />
        </div>
        {!isValidatingTried && !bankName ? (
          <div className={css.errorMessage}>빈칸을 입력해주세요.</div>
        ) : null}
      </div>

      <div className={css.refundInfoWrap}>
        <div className={css.refundInfoTitle}>계좌번호</div>
        <div className={css.refundInfo}>
          <input
            type="text"
            placeholder="계좌번호를 입력해주세요."
            name="bankAccount"
            onChange={e => {
              setAccountInfo(e);
            }}
          />
        </div>
        {!isValidatingTried && !bankAccount ? (
          <div className={css.errorMessage}>빈칸을 입력해주세요.</div>
        ) : null}
      </div>

      <div className={css.refundInfoWrap}>
        <div className={css.refundInfoTitle}>예금주명 (본인명)</div>
        <div className={css.refundInfoContent}>
          <div className={css.refundInfo}>
            <input
              type="text"
              placeholder="입력해주세요."
              name="bankHolder"
              onChange={e => {
                setAccountInfo(e);
              }}
            />
          </div>
          <div
            className={css.checkAccount}
            onClick={() => {
              verifyAccount();
            }}
          >
            계좌확인
          </div>
        </div>

        {!isValidatingTried && !bankHolder ? (
          <div className={css.errorMessage}>빈칸을 입력해주세요.</div>
        ) : null}
      </div>
    </div>
  );
};

export default inject('orderpayment')(RefundAccount);

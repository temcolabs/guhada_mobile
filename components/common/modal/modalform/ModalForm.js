import React from 'react';
import ModalWrapper from '../ModalWrapper';
import css from './ModalForm.module.scss';

/**
 * ModalFormTitle, ModalFormContents, ModalFormSubmit 등을 넣어서 사용할 상위 컴포넌트
 * rest props는 ModalWrapper 컴포넌트 참조
 */
export default function ModalForm({ children, wrapperStyle = {}, ...rest }) {
  return (
    <ModalWrapper
      contentStyle={{
        positon: 'relative',
        top: '0',
        left: '0',
        transform: 'translate(0,0)',
      }}
      overlayStyle={{
        zIndex: 3001,
      }}
      {...rest}
    >
      <div className={css.wrapper} style={wrapperStyle}>
        {children}
      </div>
    </ModalWrapper>
  );
}

export const ModalFormField = ({ children, wrapperStyle = {} }) => {
  return (
    <div className={css.formField} style={wrapperStyle}>
      {children}
    </div>
  );
};

export const ModalFormLabel = ({ children, wrapperStyle = {} }) => {
  return (
    <div className={css.formField__label} style={wrapperStyle}>
      {children}
    </div>
  );
};

export const ModalFormValue = ({ children, wrapperStyle = {} }) => {
  return (
    <div className={css.formField__value} style={wrapperStyle}>
      {children}
    </div>
  );
};

export const ModalFormTextValue = ({ children, wrapperStyle = {} }) => {
  return (
    <div className={css.formField__textValue} style={wrapperStyle}>
      {children}
    </div>
  );
};

// 에러 메시지
export const ModalFormErrorMessage = ({ children }) => {
  return <div className={css.formField__errorMessage}>{children}</div>;
};

import React from 'react';
import ModalWrapper from './ModalWrapper';

/**
 * 팝업이 열릴 때 뒤에 표시할 반투명 마스크
 */
export default function Mask({
  zIndex,
  isOpen = false,
  duration = 400,
  overlayStyle,
  ...rest
}) {
  return (
    <>
      {isOpen && (
        <ModalWrapper
          {...rest}
          isOpen={isOpen}
          zIndex={zIndex}
          closeTimeout={0}
          overlayStyle={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            transition: 'none',
            ...overlayStyle,
          }}
        />
      )}
    </>
  );
}

export const WhiteMask = (props) => {
  return (
    <Mask
      {...props}
      overlayStyle={{
        backgroundColor: 'white',
      }}
    />
  );
};

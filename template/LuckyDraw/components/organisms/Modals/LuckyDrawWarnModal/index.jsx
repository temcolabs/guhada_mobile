import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from 'components/molecules/Modal/ModalWrapper/index';

import {
  Wrapper,
  CloseButton,
  SectionInfo,
  SectionInfoTitle,
  SectionInfoContents,
  SectionButton,
} from './Styled';

/**
 * 럭키드로우 유의사항 모달
 * @param {Boolean} {isOpen
 * @param {Function} onClose}
 * @returns
 */
function LuckyDrawWarnModal({ isOpen, onClose }) {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <Wrapper>
        <CloseButton
          imageUrl={'/public/icon/modal_close.png'}
          onClick={onClose}
        />
        <SectionInfo>
          <SectionInfoTitle>유의사항</SectionInfoTitle>
          <SectionInfoContents>
            <div>· 이벤트 상품은 100% 정품입니다.</div>
            <div>· 본인인증 및 마케팅 수신 동의한 고객만 응모 가능합니다.</div>
            <div>
              · 응모는 블록체인 기반으로 투명하고 공정하게 이루어집니다.
            </div>
            <div>· 상품별로 인당 1회 참여 가능합니다.</div>
            <div>· 당첨자 본인만 구매가 가능합니다.</div>
            <div>· 마감 시간 이내에 미구매 시, 당첨이 취소됩니다.</div>
            <div>· 타인 계정으로 응모 시, 경품 수령이 불가합니다.</div>
            <div>· 당첨 상품은 교환이 불가하며, 반품은 가능합니다.</div>
            <div>
              · 부정행위, 인위적 조작 등 이벤트 방해 시 당첨 취소됩니다.
            </div>
            <div>
              · 해당 이벤트는 별도 고지 없이 변경 또는 종료될 수 있습니다.
            </div>
          </SectionInfoContents>
        </SectionInfo>
      </Wrapper>
      <SectionButton isActive={true} onClick={onClose}>
        확인
      </SectionButton>
    </ModalWrapper>
  );
}

LuckyDrawWarnModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default LuckyDrawWarnModal;

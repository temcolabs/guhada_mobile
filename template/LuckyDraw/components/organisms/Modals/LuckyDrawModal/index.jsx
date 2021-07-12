import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from 'components/molecules/Modal/ModalWrapper/index';
import {
  Wrapper,
  SectionContents,
  SectionInfo,
  CloseButton,
  CloseButtonSection,
  SectionStatus,
  SectionStatusIconSection,
  SectionStatusIcon,
  SectionTitle,
  SectionDescriptions,
  SectionButton,
} from './Styled';

const STATUS_RESPONSES = {
  START: {
    text: '응모완료',
    icon: '/public/icon/luckydraw/check_icon.png',
  },
  WINNER_ANNOUNCEMENT: {
    text: '당첨자 발표',
    icon: '/public/icon/luckydraw/gift_icon.png',
  },
};

/**
 * LuckyDrawModal
 * @param {Boolean} isOpen
 * @param {String} status ( START, WINNER_ANNOUNCEMENT, CLIP )
 * @param {String} contents 본문
 * @param {Function} onClose
 * @returns
 */
function LuckyDrawModal({ isOpen, status, contents, onClose }) {
  const isBigModal =
    status === 'START' || status === 'WINNER_ANNOUNCEMENT' ? true : false;
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <Wrapper isBigModal={isBigModal}>
        <SectionContents isBigModal={isBigModal}>
          <CloseButtonSection>
            <CloseButton
              imageUrl={'/public/icon/modal_close.png'}
              onClick={onClose}
            />
          </CloseButtonSection>
          <SectionInfo>
            {isBigModal && (
              <SectionStatus>
                <SectionStatusIconSection>
                  <SectionStatusIcon imageUrl={STATUS_RESPONSES[status].icon} />
                </SectionStatusIconSection>
                <SectionTitle>{STATUS_RESPONSES[status].text}</SectionTitle>
              </SectionStatus>
            )}
            <SectionDescriptions>{contents}</SectionDescriptions>
          </SectionInfo>
        </SectionContents>
        <SectionButton isActive={true} onClick={onClose}>
          확인
        </SectionButton>
      </Wrapper>
    </ModalWrapper>
  );
}

LuckyDrawModal.propTypes = {
  isOpen: PropTypes.bool,
  status: PropTypes.string,
  contents: PropTypes.string,
  onClose: PropTypes.func,
};

export default LuckyDrawModal;

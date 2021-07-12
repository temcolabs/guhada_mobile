import React from 'react';
import ModalMobileWrapper from 'components/molecules/Modal/ModalMobileWrapper';

import PropTypes from 'prop-types';
import Image from 'components/atoms/Image';

import { Header, HeaderContents, HeaderTitle } from './Styled';

const IMAGE_PATH = {
  back: '/public/icons/btn_top_back/btn_top_back@3x.png',
  close: '/public/icons/btn_top_close/btn_top_close@3x.png',
};

/**
 *
 * @param {*} isModalOpen
 * @param {*} headerStatus, title, back, close
 * @param {*} onCloseModal
 * @param {*} children
 * @returns
 */
function HeaderModalWrapper({
  isModalOpen,
  headerStatus,
  onCloseModal,
  onClickBackModal,
  children,
}) {
  return (
    <ModalMobileWrapper
      isOpen={isModalOpen}
      onClose={onCloseModal}
      contentStyle={{ overflowY: 'scroll' }}
      lockScroll={true}
    >
      <Header>
        <div
          style={{ width: '30px', height: '30px' }}
          onClick={onClickBackModal}
        >
          {headerStatus.back && <Image src={IMAGE_PATH.back} />}
        </div>
        <div>
          {headerStatus.title && (
            <HeaderTitle>{headerStatus.title}</HeaderTitle>
          )}
        </div>
        <div style={{ width: '30px', height: '30px' }} onClick={onCloseModal}>
          {headerStatus.close && <Image src={IMAGE_PATH.close} />}
        </div>
      </Header>
      <HeaderContents>{children}</HeaderContents>
    </ModalMobileWrapper>
  );
}

HeaderModalWrapper.propTypes = {
  isModalOpen: PropTypes.bool,
  headerStatus: PropTypes.shape({
    title: PropTypes.string,
    back: PropTypes.bool,
    close: PropTypes.bool,
  }),
  onCloseModal: PropTypes.func,
  onClickBackModal: PropTypes.func,
};

export default HeaderModalWrapper;

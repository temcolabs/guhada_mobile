import { useState } from 'react';
import PropTypes from 'prop-types';
import css from './BlockChainModal.module.scss';

import ModalMobileWrapper from 'components/molecules/Modal/ModalMobileWrapper';
import Image from 'components/atoms/Image';

const BLOCKCHAIN_INFO_CONTENTS = [
  'Serial ID',
  'Brand Name',
  'Owner',
  'Product Name',
  'Price',
  'Color',
  'Tracker',
];

const IMAGE_PATH = {
  closeBtn: '/public/icon/btn-tool-close.png',
};

function BlockChainModal({ isModalOpen, onCloseModal, deals }) {
  const [customRadius, setCustomRadius] = useState({
    borderRadius: '10px',
  });

  const handleScrollTop = (scrollTop) => {
    if (scrollTop === 1) setCustomRadius({});
    else setCustomRadius({ borderRadius: '10px' });
  };

  return (
    <ModalMobileWrapper
      isOpen={isModalOpen}
      onClose={onCloseModal}
      zIndex={3001}
      scrollTop={handleScrollTop}
    >
      <div className={css.productDetail__blockChainModalWrap}>
        <div className={css.productSection}>
          {/* Product Image */}
          <Image src={deals?.imageUrls[0]} size={'contain'} />
          {/* Close button */}
          <div className={css.closeBtn} onClick={onCloseModal}>
            <Image src={IMAGE_PATH.closeBtn} width={'30px'} height={'30px'} />
          </div>
          {/* GradientWrap & Info */}
          <div className={css.gradientWrap}>
            <div className={css.productInfo}>
              <div className={css.brandInfo}>
                <div>{deals?.brandName}</div>
                <div>{deals?.name}</div>
              </div>
              <div className={css.priceInfo}>
                {deals?.discountPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        {/* Blockchain Info */}
        <div className={css.blockChainSection} style={customRadius}>
          {deals?.trackRecords && deals?.trackRecords.length
            ? deals?.trackRecords.map((o, i) => (
                <div key={o.serialId} className={css.blockChainInfo}>
                  <div className={css.blockChainInfo__header}>{i + 1}</div>
                  <div className={css.blockChainInfo__content}>
                    {BLOCKCHAIN_INFO_CONTENTS.map((v, i) => (
                      <div
                        key={`${v}-${i}`}
                        className={css.blockChainInfo__content__wrap}
                      >
                        <div className={css.head}>{v}</div>
                        <div className={css.description}>
                          {v === 'Serial ID' && o.serialId}
                          {v === 'Brand Name' && o.brandName}
                          {v === 'Owner' && o.owner}
                          {v === 'Product Name' && o.productName}
                          {v === 'Price' && o.price.toLocaleString()}
                          {v === 'Color' && o.color}
                          {v === 'Tracker' && (
                            <a className={css.link} href={o.txUrl}>
                              Block Chain Link
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : ''}
        </div>
      </div>
    </ModalMobileWrapper>
  );
}

BlockChainModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  deals: PropTypes.object.isRequired,
};

export default BlockChainModal;

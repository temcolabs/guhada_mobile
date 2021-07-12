import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModalMobileWrapper from 'components/molecules/Modal/ModalMobileWrapper';
import { LoadingSpinner } from 'components/common/loading/Loading';

const defaultCloseButtonStyle = {
  position: 'fixed',
  right: '15px',
  top: '15px',
  zIndex: '999',
  width: '30px',
  height: '30px',
  backgroundImage: 'url("/public/icon/btn-close.png")',
  backgroundSize: 'cover',
  cursor: 'pointer',
};

const ScrollableImageModal = ({
  imgSrc,
  isModalOpen,
  handleCloseModal,
  closeButtonStyle = defaultCloseButtonStyle,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // preload image
    const image = new Image();
    image.src = imgSrc;
    image.onload = () => {
      setLoaded(true);
    };
  }, [imgSrc]);

  return (
    <>
      <div style={closeButtonStyle} onClick={handleCloseModal} />
      <ModalMobileWrapper
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        contentStyle={{ overflowY: 'scroll' }}
        lockScroll={true}
      >
        {loaded ? (
          <img style={{ width: '100vw' }} src={imgSrc} />
        ) : (
          <LoadingSpinner />
        )}
      </ModalMobileWrapper>
    </>
  );
};

ScrollableImageModal.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  closeButtonStyle: PropTypes.object,
};

export default ScrollableImageModal;

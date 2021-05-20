import React from 'react';
import PropTypes from 'prop-types';

import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import ModalLayout from 'components/layout/ModalLayout';
import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  back: '/static/icons/btn_top_back/btn_top_back.png',
};

function HashtagModal({ isOpen, onClose }) {
  return (
    <SlideIn
      isVisible={isOpen}
      zIndex={9999}
      direction={slideDirection.BOTTOM}
      // onClose={onClose}
      // wrapperStyle={{ backgroundColor: 'rgba(17,17,17, 0.7)' }}
      // wrapperChildStyle={{ backgroundColor: 'white', height: '85.9375%' }}
    >
      {/* <div
        style={{ width: '100vw', height: '85.9375%', backgroundColor: 'white' }}
      /> */}
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(17,17,17, 0.7)',
        }}
      >
        <div
          style={{
            fontFamily: 'Roboto',
            color: '#111',
            display: 'flex',
            flexFlow: 'row wrap',
            paddingTop: '10px',
            position: 'relative',
            top: '15%',
            width: '100vw',
            height: '85.9375%',
            backgroundColor: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '60px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '19%',
                height: '100%',
              }}
            >
              <Image src={IMAGE_PATH.back} width={'30px'} height={'30px'} />
              <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>#</span>
            </div>
            <div style={{ width: '85%', height: '100%' }} />
          </div>
        </div>
      </div>
    </SlideIn>
  );
}

HashtagModal.propTypes = {};

export default HashtagModal;

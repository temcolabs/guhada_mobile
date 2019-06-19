import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import ModalWrapper from './ModalWrapper';
import Alert from './Alert';
import Confirm from './Confirm';
import { scrollY } from 'lib/dom';

const stories = storiesOf('common/modal', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('Modal', () => {
  return (
    <ModalWrapper
      isOpen={boolean('isOpen', true)}
      onClose={() => {}}
      contentStyle={{}}
      contentLabel={'storymodal'}
      zIndex={1000}
    >
      <div
        style={{
          padding: '20px',
          width: '400px',
          height: '200px',
          background: '#fff',
        }}
      >
        {text('Label', 'modal')}
      </div>
    </ModalWrapper>
  );
});

stories.add('Modal (big size), scrollable', () => {
  return (
    <div style={{ width: '100%', height: '2000px' }}>
      <ModalWrapper
        isOpen={boolean('isOpen', true)}
        onClose={() => {}}
        contentLabel={'storymodal'}
        zIndex={1000}
        lockScroll={boolean('lockScroll', false)}
        isBigModal={boolean('isBigModal', true)}
        contentStyle={{
          top: `${scrollY() + 100}px`, // 현재 스크롤 위치 + 임의 간격
          width: '600px',
          height: '800px',
          background: 'gold',
        }}
      >
        <div style={{}}>{text('Label', 'modal')}</div>
      </ModalWrapper>
    </div>
  );
});

stories.add('Alert', () => {
  return (
    <Alert
      isOpen={boolean('isOpen', true)}
      content={'[HMR] Checking for updates on the server...'}
      onConfirm={action('onConfirm')}
    />
  );
});
stories.add('Confirm', () => {
  return <Confirm isOpen={boolean('isOpen', true)} content={'확인 창입니다'} />;
});

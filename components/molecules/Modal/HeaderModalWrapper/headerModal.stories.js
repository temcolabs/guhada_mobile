import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import HeaderModalWrapper from '.';
import scrollY from 'lib/dom/scrollY';

const stories = storiesOf('molecules/modal', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('HeaderModalWrapper', () => {
  return (
    <HeaderModalWrapper
      isModalOpen={boolean('isOpen', true)}
      headerStatus={{ title: '테스트', back: true, close: true }}
      onClose={() => {}}
      contentStyle={{ overflowY: 'scroll' }}
      lockScroll={false}
    >
      <div>test</div>
    </HeaderModalWrapper>
  );
});

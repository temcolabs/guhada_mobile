import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';

import SlideUpOptions from './SlideUpOptions';
import SearchInput from './SearchInput';
import TextInput from './TextInput';

const stories = storiesOf('community/form', module);

const BBSWrapper = fn => (
  <div style={{ width: '970px', margin: '0 auto' }}>{fn()}</div>
);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(BBSWrapper);

stories.add('SlideUpOptions', () => {
  return (
    <SlideUpOptions
      renderButton={() => {
        return (
          <div style={{ width: '200px', position: 'relative' }}>
            <button>click to see options</button>
          </div>
        );
      }}
      onChangeOption={action('onChangeOption')}
      isVisible={boolean('isVisible', false)}
      options={[
        { label: '최신순', value: '최신순' },
        { label: '좋아요순', value: '좋아요순' },
        { label: '조회순', value: '조회순' },
        { label: '댓글순', value: '댓글순' },
      ]}
    />
  );
});
stories.add('SlideUpOptions with slideUpContent', () => {
  return (
    <SlideUpOptions
      isVisible={boolean('isVisible', false)}
      renderButton={slideArea => {
        return (
          <div style={{ width: '300px', position: 'relative' }}>
            <button>test</button>
            {slideArea()}
          </div>
        );
      }}
      wrapperStyle={{
        width: '300px',
        border: 'none',
      }}
      renderSlideArea={() => {
        return <div style={{ background: 'aqua', height: '30px' }}>test</div>;
      }}
    />
  );
});

stories.add('TextInput', () => {
  return <TextInput />;
});

stories.add('SearchInput', () => {
  return <SearchInput />;
});

stories.add('SearchInput with style', () => {
  return (
    <SearchInput
      wrapperStyle={{
        paddingTop: '20px',
        paddingBottom: '20px',
        background: '#eee',
      }}
    />
  );
});

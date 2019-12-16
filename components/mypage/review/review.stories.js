import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, select, number } from '@storybook/addon-knobs';
import ReviewWriteModalScore from './ReviewWriteModalScore';

const stories = storiesOf('mypage/review', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('ReviewWriteModalScore', () => {
  return (
    <div>
      <ReviewWriteModalScore
        score={1}
        itemsText={['작아요', '작아요', '커요']}
        items={[]}
      />
      <ReviewWriteModalScore
        score={1}
        itemsText={['작아요', '작아요', '커요']}
        items={[]}
      />
    </div>
  );
});

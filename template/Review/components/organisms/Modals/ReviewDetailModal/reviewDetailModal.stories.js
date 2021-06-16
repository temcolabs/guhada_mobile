import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean, text } from '@storybook/addon-knobs';
import ReviewDetailModal from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/organisms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('ReviewDetailModal', () => {
  return (
    <ReviewDetailModal
      isModalOpen={boolean('isModalOpen', true)}
      reviewId={number('reviewId', 51)}
      onCloseModal={text('onCloseModal', 'Closed event')}
    />
  );
});

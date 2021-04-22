import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  array
} from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import ModalPhotoDetail from './index';

const stories = storiesOf('molecules/modal', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

stories.add('ModalPhotoDetail', () => {
  return (
    <ModalPhotoDetail
      isOpen={boolean('isOpen', true)}
      photos={array('photos', [
      {
        reviewPhotoUrl: "https://d22su0sor8h41q.cloudfront.net/images/users/337/reviews/5dcaa8501c514e8f9466e3341b16bbe1.jpeg",
      },
      { 
        reviewPhotoUrl: "https://d22su0sor8h41q.cloudfront.net/images/users/337/reviews/5dcaa8501c514e8f9466e3341b16bbe1.jpeg" 
      }])}
      onClickClose={text('onClickClose', 'Function is close event')}
    />
  );
});

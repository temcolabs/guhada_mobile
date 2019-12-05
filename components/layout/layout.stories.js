import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import DefaultLayout from './DefaultLayout';
import DetailPageLayout from './DetailPageLayout';

const stories = storiesOf('layout', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('DefaultLayout', () => {
  return <DefaultLayout />;
});

stories.add('DetailPageLayout', () => {
  return <DetailPageLayout pageTitle={text('pageTitle', '상세페이지')} />;
});

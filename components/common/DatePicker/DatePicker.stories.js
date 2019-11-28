import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  // text,
  // boolean,
  // number,
  // color,
  // select,
} from '@storybook/addon-knobs';
import SingleDatePickerWrapper from './SingleDatePickerWrapper';
import moment from 'moment';

const stories = storiesOf('common/DatePicker', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('SingleDatePickerWrapper', () => {
  return (
    <SingleDatePickerWrapper
      initialDate={moment()}
      onSelect={action('onSelect')}
      enableOutsideDays
    />
  );
});

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
import Pagination from './index';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';

const stories = storiesOf('common/Paginate', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withCenteredDeco);

stories.add('default', () => {
  return (
    <Pagination
      onChangePage={action('onChangePage', 10)}
      initialPage={number('initialPage', 3)}
      itemsCountPerPage={number('itemsCountPerPage', 10)}
      totalItemsCount={number('totalItemsCount', 450)}
    />
  );
});

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
import CommunityPageHeader from './CommunityPageHeader';

const stories = storiesOf('community', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('CommunityPageHeader', () => {
  return <CommunityPageHeader>명품지식</CommunityPageHeader>;
});

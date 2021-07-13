import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import ReviewWriteHashtagModal from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/organisms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('ReviewWriteHashtagModal', () => {
  return (
    <ReviewWriteHashtagModal
      isOpen={boolean('isOpen', false)}
      delHashtag={text('delHashtag', '')}
      onClose={text('onClose', 'Closed event')}
    />
  );
});

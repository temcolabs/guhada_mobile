import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import LuckyDrawCardFrame from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/LuckyDraw/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('LuckyDrawCardFrame', () => {
  return (
    <LuckyDrawCardFrame
      imageUrl={text(
        'imageUrl',
        'https://d15jp4iwerkqw1.cloudfront.net/images/event/lucky/cf0f4bd3da6d443db222adff9e1fc842.png'
      )}
      statusCode={select('statusCode', ['START', 'NORMAL'])}
    />
  );
});

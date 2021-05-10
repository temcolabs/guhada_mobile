import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number, object } from '@storybook/addon-knobs';
import LuckyDrawPhotoFrame from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('molecules/PhotoFrame', module);
const Wrapper = styled.div`
  width: 600px;
`;

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('LuckyDrawPhotoFrame', () => {
  return (
    <Wrapper>
      <LuckyDrawPhotoFrame
        imageUrl={text(
          'imageUrl',
          'https://d15jp4iwerkqw1.cloudfront.net/images/event/lucky/cf0f4bd3da6d443db222adff9e1fc842.png'
        )}
        statusCode={text('statusCode', 'START')}
      />
    </Wrapper>
  );
});

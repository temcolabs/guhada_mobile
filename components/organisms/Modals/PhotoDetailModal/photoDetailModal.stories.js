import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, object } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import PhotoDetailModal from './index';

const stories = storiesOf('organisms/Modals', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

stories.add('PhotoDetailModal', () => {
  return (
    <Wrapper>
      <PhotoDetailModal
        isOpen={boolean('isOpen', true)}
        photos={object('photos', [
          {
            reviewPhotoUrl:
              'https://d15jp4iwerkqw1.cloudfront.net/images/users/84394/reviews/f52d391fa6254385a76585e014a525a5.jpg?w=375',
          },
          {
            reviewPhotoUrl:
              'https://d15jp4iwerkqw1.cloudfront.net/images/users/84394/reviews/6685801be47142808866d63d496c5ef4.jpg?w=375',
          },
        ])}
        onClickClose={text('onClickClose', 'Close event')}
      />
    </Wrapper>
  );
});

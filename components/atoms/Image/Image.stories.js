import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import Image from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('atoms', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

export const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

stories.add('Image', () => {
  const typeOptions = {
    Block: 'block',
    Image: 'image',
  };
  const src =
    'https://d15jp4iwerkqw1.cloudfront.net/images/users/143466/reviews/a8a11d2aabd04b3e87d85a4ec48020c0.jpg';
  return (
    <Wrapper>
      <Image
        type={select('type', typeOptions)}
        src={text('src', src)}
        width={text('width', '320px')}
        height={text('height', '320px')}
      />
    </Wrapper>
  );
});

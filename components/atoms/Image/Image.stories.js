import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import {
  withKnobs,
  text,
  select,
  boolean,
  object,
} from '@storybook/addon-knobs';
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
  const sizeOptions = {
    cover: 'cover',
    contain: 'contain',
  };
  const src =
    'https://d15jp4iwerkqw1.cloudfront.net/images/users/143466/reviews/a8a11d2aabd04b3e87d85a4ec48020c0.jpg';
  return (
    <Wrapper>
      <Image
        isLazy={boolean('isLazy', false)}
        customStyle={object('customStyle')}
        src={text('src', src)}
        size={select('size', sizeOptions)}
        width={text('width', '320px')}
        height={text('height', '320px')}
      />
    </Wrapper>
  );
});

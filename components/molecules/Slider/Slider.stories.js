import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select, object } from '@storybook/addon-knobs';
import Slider from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('molecules', module);

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

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

stories.add('Slider', () => {
  return (
    <Wrapper>
      <Slider
        {...settings}
        _guide={text('text', 'https://react-slick.neostack.com/')}
        children={text('text', 'children components')}
        settings={object('settings', settings)}
      >
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
      </Slider>
    </Wrapper>
  );
});

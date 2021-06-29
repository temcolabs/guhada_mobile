import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object } from '@storybook/addon-knobs';
import ReviewBanner from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewBanner', () => {
  return (
    <Wrapper>
      <ReviewBanner banners={object('banners')} />
    </Wrapper>
  );
});

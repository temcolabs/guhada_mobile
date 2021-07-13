import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object } from '@storybook/addon-knobs';
import ReviewHashtagFavoriteHeading from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/atoms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewHashtagFavoriteHeading', () => {
  return (
    <Wrapper>
      <ReviewHashtagFavoriteHeading headingStyles={object('headingStyles')} />
    </Wrapper>
  );
});

import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, select, object } from '@storybook/addon-knobs';
import ReviewCardImage from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewCardImage', () => {
  return (
    <Wrapper>
      <div style={{ width: '340px', height: '320px' }}>
        <ReviewCardImage
          isLazy={boolean('isLazy', false)}
          type={select('type', ['list', 'detail'])}
          images={object('images', [
            'https://d22su0sor8h41q.cloudfront.net/images/users/407/reviews/6be85390be5e4b12ae7538cfbab348ee.jpg',
            'https://d22su0sor8h41q.cloudfront.net/images/users/407/reviews/86a8091f1dfb4482bf68aa27e6e42ba0.jpg',
            'https://d22su0sor8h41q.cloudfront.net/images/users/407/reviews/065cf495fde144a4af086591acbe30e3.png',
          ])}
        />
      </div>
    </Wrapper>
  );
});

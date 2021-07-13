import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, boolean } from '@storybook/addon-knobs';
import ReviewDealItem from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewDealItem', () => {
  return (
    <Wrapper>
      <ReviewDealItem
        isLazy={boolean('isLazy', false)}
        horizontal={boolean('horizontal', true)}
        deal={object('deal', {
          brandName: 'Maison Margiela',
          dealName: '메종 마르지엘라 코트 S50AA0103 S53030001F',
          productImage: {
            url:
              'https://d22su0sor8h41q.cloudfront.net/images/products/687984/thumbs/c875ef7246e34618a7c1c9c9658c6f5a.jpg',
          },
          sellPrice: 3932000,
          sellerName: 'BrianLeeShop2',
        })}
      />
    </Wrapper>
  );
});

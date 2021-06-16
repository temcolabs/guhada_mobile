import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text, object } from '@storybook/addon-knobs';
import ReviewDealSection from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/organisms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

// comment, onClickCommentSubmit, onClickCommentDelete

stories.add('ReviewDealSection', () => {
  return (
    <ReviewDealSection
      isLazy={boolean('isLazy', false)}
      header={text('header', '비슷한 상품')}
      deals={object('deals', [
        {
          brandName: 'Maison Margiela',
          dealName: '메종 마르지엘라 코트 S50AA0103 S53030001F',
          productImage: {
            url:
              'https://d22su0sor8h41q.cloudfront.net/images/products/687984/thumbs/c875ef7246e34618a7c1c9c9658c6f5a.jpg',
          },
          sellPrice: 3932000,
          sellerName: 'BrianLeeShop2',
        },
        {
          brandName: 'ViVienne westwood',
          dealName: '비비안웨스트우드 티셔츠 37010002 J001MN401GO',
          productImage: {
            url:
              'https://d22su0sor8h41q.cloudfront.net/images/products/687983/thumbs/6761fd2b00bc4bfe91c042a4c7a8d60b.jpg',
          },
          sellPrice: 372000,
          sellerName: 'BrianLeeShop2',
        },
        {
          brandName: 'Other Brands',
          dealName: '스니커즈 BB1001PX1080111 WHITE',
          productImage: {
            url:
              'https://d22su0sor8h41q.cloudfront.net/images/products/687982/thumbs/8a3960c7015d4782ab18ef6b5d951bdf.jpg',
          },
          sellPrice: 568000,
          sellerName: 'BrianLeeShop2',
        },
      ])}
      horizontal={boolean('horizontal', true)}
    />
  );
});

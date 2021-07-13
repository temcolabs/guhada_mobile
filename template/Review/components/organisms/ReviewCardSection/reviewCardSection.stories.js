import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text, object } from '@storybook/addon-knobs';
import ReviewCardSection from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/organisms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

// isLazy, review, onClickLike, onClickProduct

stories.add('ReviewCardSection', () => {
  return (
    <ReviewCardSection
      isLazy={boolean('isOpen', false)}
      review={object('review', {
        brandName: 'BALENCIAGA',
        contents: '좋아요!!!',
        dealId: 258855,
        dealName: '발랜시아가 스니커즈 blee4',
        id: 51,
        nickname: 'BrianLeeShop2',
        productImageUrl:
          'https://d22su0sor8h41q.cloudfront.net/images/deals/2bb4672266504594a15c8086ef62ab4d.JPG',
        rating: 'FIVE',
        reviewImageList: [
          'https://d22su0sor8h41q.cloudfront.net/images/users/337/reviews/6bcaf08170124014856204ec219608d5.png',
        ],
      })}
      onClickLike={text('onClickLike', 'Like flag on / off')}
      onClickProduct={text('onClose', 'Moved to product detail')}
    />
  );
});

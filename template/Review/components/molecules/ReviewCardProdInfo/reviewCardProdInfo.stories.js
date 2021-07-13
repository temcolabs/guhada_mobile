import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import ReviewCardProdInfo from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewCardProdInfo', () => {
  return (
    <Wrapper>
      <ReviewCardProdInfo
        dealId={number('dealId', 258855)}
        imageUrl={text(
          'imageUrl',
          'https://d22su0sor8h41q.cloudfront.net/images/deals/2bb4672266504594a15c8086ef62ab4d.JPG'
        )}
        title={text('title', 'BALENCIAGA')}
        contents={text('contents', '발랜시아가 스니커즈 blee4')}
        onClickProduct={text('onClickProduct', 'Moved to product detail')}
      />
    </Wrapper>
  );
});

import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import LuckyDrawCard from '.';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('template/LuckyDraw/components/organisms', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('LuckyDrawCard', () => {
  return (
    <LuckyDrawCard
      brandName={text('brandName', 'OFF-WHITE')}
      dealId={number('dealId', 5075395)}
      discountPrice={number('discountPrice', 100000)}
      discountRate={number('discountRate', 83.6)}
      imageUrl={text(
        'imageUrl',
        'https://d15jp4iwerkqw1.cloudfront.net/images/event/lucky/cf0f4bd3da6d443db222adff9e1fc842.png'
      )}
      requestToAt={number('requestToAt', 611000)}
      sellPrice={number('sellPrice', 611000)}
      statusCode={text('statusCode', 'START')}
      statusText={text('statusText', '응모하기')}
      title={text('title', '오프화이트 남성 핸드 로고 후드 블랙_S')}
    />
  );
});

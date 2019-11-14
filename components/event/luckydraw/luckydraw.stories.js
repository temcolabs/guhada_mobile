import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  object,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import LuckydrawTimer from './LuckydrawTimer';
import LuckyDrawMainSlider from './LuckyDrawMainSlider';
import LuckyDrawItem from './LuckyDrawItem';

const stories = storiesOf('event/luckydraw', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

stories.add('LuckydrawTimer', () => {
  return (
    <div style={{ backgroundColor: '#13182e' }}>
      <LuckydrawTimer initialTimeLeft={number('timeLeft', 159980)} />
    </div>
  );
});

stories.add('LuckyDrawMainSlider', () => {
  return (
    <div style={{ marginTop: '150px' }}>
      <LuckyDrawMainSlider
        imageList={[
          {
            titleImageUrl:
              'https://d3ikprf0m31yc7.cloudfront.net/deals/luckydraw/13726240b865439b9bbe6d24c9f1efa5.png',
            requestFromAt: 1573538400000,
            title: '[변경금지] 럭키드로우 테스트 상품2',
          },
          {
            titleImageUrl:
              'https://d3ikprf0m31yc7.cloudfront.net/deals/luckydraw/1be64799a7f9467d9907f78ced68bae9.png',
            requestFromAt: 1573797600000,
            title: '[변경금지] 럭키드로우 테스트 상품3',
          },
        ]}
      />
    </div>
  );
});

stories.add('LuckyDrawItem', () => {
  return (
    <div style={{ width: '420px', margin: '50px auto 100px' }}>
      <LuckyDrawItem
        isFirst={boolean('isFisrt', true)}
        data={object('data', {
          dealId: 23880,
          title: '[변경금지] 럭키드로우 테스트 상품2',
          sellPrice: 50000.0,
          discountPrice: 45000.0,
          discountRate: 10,
          imageUrl:
            'https://d3ikprf0m31yc7.cloudfront.net/deals/luckydraw/0f5449e6ffba40039f00732a8fbf354a.png',
          now: 1573612416,
          requestFromAt: 1573538400000,
          requestToAt: 1573624800000,
          remainedTimeForStart: -74016,
          remainedTimeForEnd: 12383,
          winnerAnnouncementAt: 1573628400000,
          remainedTimeForWinnerAnnouncement: 15983,
          winnerBuyFromAt: 1573628400000,
          winnerBuyToAt: 1573714800000,
          statusCode: 'START',
          statusText: '응모하기',
        })}
      />
    </div>
  );
});

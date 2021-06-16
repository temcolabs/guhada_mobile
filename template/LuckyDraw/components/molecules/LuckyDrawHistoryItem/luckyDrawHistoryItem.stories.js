import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import LuckyDrawHistoryItem from './index';

const stories = storiesOf('template/LuckyDraw/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

const item = {
  dealId: 75881,
  brandName: 'Agatha',
  bgColor: '#004ba9',
  title: '애플 에어팟 2세대 무선충전',
  sellPrice: 249000,
  discountPrice: 25000,
  discountRate: 90,
  imageUrl:
    'https://d22su0sor8h41q.cloudfront.net/images/deals/luckydraw/2ab5a233913e4cb9bf96fe8e25db08d3.png',
  now: 1619493493,
  requestFromAt: 1594432800000,
  requestToAt: 1596160800000,
  remainedTimeForStart: -25060693,
  remainedTimeForEnd: -23332693,
  winnerAnnouncementAt: 1594522800000,
  remainedTimeForWinnerAnnouncement: -24970693,
  winnerBuyFromAt: 1594522800000,
  winnerBuyToAt: 1594609200000,
  statusCode: 'WINNER_ANNOUNCEMENT',
  statusText: '당첨자 발표',
};

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

stories.add('LuckyDrawHistoryItem', () => {
  return (
    <Wrapper>
      <LuckyDrawHistoryItem item={object('item', item)} />
    </Wrapper>
  );
});

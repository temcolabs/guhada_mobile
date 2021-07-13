import { storiesOf } from '@storybook/react';
import { withKnobs, array } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import MainHotKeywordItem from './index';

const stories = storiesOf('molecules/Items', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

const hotKeyword = [
  {
    height: 410,
    id: 25,
    keyword: '뮬',
    priority: 1,
    searchKeyword: '뮬 더베이스 21SS',
    url:
      'https://prod-guhada.s3.ap-northeast-2.amazonaws.com/images/hot-keyword/20210409_hot_keyword1.png',
    width: 410,
  },
];

stories.add('MainHotKeywordItem', () => {
  return <MainHotKeywordItem hotKeyword={array('hotKeyWord', hotKeyword)} />;
});

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import BoardTitle from './BoardTitle';
import BoardCategoryFilter from './BoardCategoryFilter';
import BoardListItem from './BoardListItem';
import BoardGridItem, { BoardGridContainer } from './BoardGridItem';
import SortButton from './SortButton';
import SearchInputOption from './SearchInputOption';
import BoardSearch from './BoardSearch';
import { devLog } from 'lib/common/devLog';

const stories = storiesOf('community/list', module);
// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));
stories.addDecorator(withCenteredDeco);

stories.add('BoardTitle', () => {
  return <BoardTitle>게시판 이름</BoardTitle>;
});

stories.add('BoardCategoryFilter', () => {
  return <BoardCategoryFilter />;
});

stories.add('SortButton', () => {
  return (
    <SortButton
      options={[
        { label: '최신순', value: '최신순' },
        { label: '좋아요순', value: '좋아요순' },
        { label: '조회순', value: '조회순' },
        { label: '댓글순', value: '댓글순' },
      ]}
      onChangeOption={(o) => devLog(`o`, o)}
      optionsWrapperStyle={{}}
    />
  );
});

stories.add('SortButton - bigSize', () => {
  return (
    <SortButton
      options={[
        { label: '최신순', value: '최신순' },
        { label: '좋아요순', value: '좋아요순' },
        { label: '조회순', value: '조회순' },
        { label: '댓글순', value: '댓글순' },
      ]}
      onChangeOption={(o) => devLog(`o`, o)}
      optionsWrapperStyle={{
        width: '600px',
        left: 0,
      }}
    />
  );
});

stories.add('BoardListItem', () => {
  return (
    <div>
      <BoardListItem />
      <BoardListItem />
      <BoardListItem />
      <BoardListItem />
    </div>
  );
});

stories.add('BoardGridItem', () => {
  return (
    <BoardGridContainer>
      <div className="gridRow">
        <div className="col_1_4">
          <BoardGridItem />
        </div>
        <div className="col_1_4">
          <BoardGridItem />
        </div>
        <div className="col_1_4">
          <BoardGridItem />
        </div>
        <div className="col_1_4">
          <BoardGridItem />
        </div>
        <div className="col_1_4">
          <BoardGridItem />
        </div>
        <div className="col_1_4">
          <BoardGridItem />
        </div>
        <div className="col_1_4">
          <BoardGridItem />
        </div>
        <div className="col_1_4">
          <BoardGridItem />
        </div>
      </div>
    </BoardGridContainer>
  );
});

stories.add('SearchInputOption', () => {
  return <SearchInputOption onChangeOption={action('onChangeOption')} />;
});

stories.add('BoardSearch', () => {
  return <BoardSearch />;
});

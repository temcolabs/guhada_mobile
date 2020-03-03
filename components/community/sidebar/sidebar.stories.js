import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import '.storybook/decorators/withRouterDeco';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import BoardMenus from './BoardMenus';
import MyBBS from './MyBBS';
import { loginStatus } from 'childs/lib/constant';
import DeletedMyActivityItem from './myArticles/DeletedMyActivityItem';
import NoMyArticles from './myArticles/NoMyArticles';
import NoMyBookmarks from './myArticles/NoMyBookmarks';

const stories = storiesOf('community', module);

const SidebarWrapper = fn => (
  <div style={{ width: '300px', margin: '0 auto' }}>{fn()}</div>
);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));
stories.addDecorator(SidebarWrapper);

stories.add('BoardMenus', () => {
  return <BoardMenus router={{ query: {} }} />;
});

stories.add('MyBBS', () => {
  return (
    <MyBBS
      login={{
        isLoggedIn: boolean('isLoggedIn', true),
        loginStatus: loginStatus.LOGIN_DONE,
      }}
      user={{ userInfo: { nickname: '템코짱짱맨' } }}
    />
  );
});

stories.add('DeletedMyActivityItem', () => {
  return (
    <div>
      <DeletedMyActivityItem />
      <DeletedMyActivityItem onDelete={action('onDelete')} />
    </div>
  );
});

stories.add('NoMyArticles', () => {
  return <NoMyArticles isNoData={boolean('isNoData', true)} />;
});

stories.add('NoMyBookmarks', () => {
  return <NoMyBookmarks />;
});

import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text, object } from '@storybook/addon-knobs';
import ReviewCommentSection from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/organisms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

// comment, onClickCommentSubmit, onClickCommentDelete

stories.add('ReviewCommentSection', () => {
  return (
    <ReviewCommentSection
      comment={object('comment', {
        content: [
          {
            comment: 'ㅇㅇ😊',
            createdBy: 544,
            createdTimestamp: 1621593477000,
            currentTimestamp: 1623893853222,
            id: 56,
            mentionUserId: null,
            mentionUserNickname: null,
            myComment: false,
            nickname: 'fe',
            profileImageUrl: null,
            userProductReviewId: 82,
          },
        ],
        totalElements: 1,
      })}
      onClickCommentSubmit={text('onClickCommentSubmit', 'Insert comment')}
      onClickCommentDelete={text('onClickCommentDelete', 'Delete comment')}
    />
  );
});

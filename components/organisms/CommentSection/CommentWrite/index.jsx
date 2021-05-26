import React, { useState, useEffect, useRef } from 'react';
import { toJS } from 'mobx';
import { MentionsInput, Mention } from 'react-mentions';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';

// TODO : 리팩토링
import Image from 'components/atoms/Image';
import Emoji from 'components/atoms/Emoji';

import {
  Wrapper,
  EmojiSection,
  InputSection,
  Avatar,
  Form,
  InputWrapper,
  TextDiv,
  SubmitDiv,
  Submit,
} from './Styled';

import { REVIEW_EMOJI_LIST } from 'template/Review/_constants';

import defaultStyle from './lib/defaultStyle';

const MENTION_STYLES = {
  position: 'relative',
  bottom: '1px',
  border: 'none',
  backgroundColor: 'white',
  color: '#024793',
  fontWeight: 'bold',
  width: '100%',
  zIndex: 1,
};

/**
 * 댓글 작성 폼
 * @param {Object} styles 커스텀 스타일링
 * @param {Function} onClickSubmit 등록
 * @returns
 */
function CommentWrite({
  mention,
  mentionUserId,
  onClearMention,
  onClickCommentSubmit,
}) {
  const textarea = useRef(null);
  const [value, setValue] = useState(''); // Textarea values
  const { user: userStore } = useStores();

  const profileImageUrl = userStore?.userInfo?.profileImageUrl;

  // Set mention
  useEffect(() => {
    if (mention) {
      setValue(`${mention} `);
      textarea.current.focus();
    }
  }, [mention]);

  // Clear mention
  useEffect(() => {
    if (!value) onClearMention();
  }, [value]);

  // Set emoji
  const onClickEmoji = (emoji) => setValue(value + emoji);

  // Update text area values
  const changeTextarea = (e) => setValue(e.target.value);

  return (
    <Wrapper>
      {/* 이모티콘 선택 리스트 */}
      <EmojiSection>
        {REVIEW_EMOJI_LIST.length
          ? REVIEW_EMOJI_LIST.map((v, i) => (
              <Emoji key={`${v}-${i}`} symbol={v} onClickEmoji={onClickEmoji} />
            ))
          : ''}
      </EmojiSection>
      {/* 입력 폼 */}
      <InputSection>
        {/* 사용자 정보 (사진) */}
        <Avatar>
          <Image
            customStyle={{ borderRadius: '50%' }}
            width={'30px'}
            height={'30px'}
            src={
              profileImageUrl
                ? profileImageUrl
                : '/static/icon/profile_non_square.png'
            }
          />
        </Avatar>
        {/* 입력 */}
        <Form>
          <InputWrapper>
            {/* 입력 Textarea */}
            <TextDiv>
              <MentionsInput
                inputRef={textarea}
                placeholder={'댓글을 입력해주세요'}
                value={value}
                onChange={changeTextarea}
                style={defaultStyle}
              >
                <Mention
                  trigger="@"
                  markup={`@[__display__]`}
                  appendSpaceOnAdd={true}
                  displayTransform={(id, display) => `@${display}`}
                  style={MENTION_STYLES}
                />
              </MentionsInput>
            </TextDiv>
            {/* 리뷰 쓰기 Submit */}
            <SubmitDiv>
              <Submit
                onClick={() => {
                  setValue('');
                  onClickCommentSubmit(mentionUserId, value);
                }}
              >
                등록
              </Submit>
            </SubmitDiv>
          </InputWrapper>
        </Form>
      </InputSection>
    </Wrapper>
  );
}

CommentWrite.propTypes = {
  onClickCommentSubmit: PropTypes.func.isRequired,
};

export default observer(CommentWrite);

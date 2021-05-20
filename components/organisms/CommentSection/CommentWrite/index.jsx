import React, { useState, useRef, useEffect } from 'react';
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
  Text,
  Submit,
} from './Styled';

import { REVIEW_EMOJI_LIST } from 'template/Review/_constants';

/**
 * 댓글 작성 폼
 * @param {Object} styles 커스텀 스타일링
 * @param {Function} onClickSubmit 등록
 * @returns
 */
function CommentWrite({ mention, onClearMention, onClickCommentSubmit }) {
  const textarea = useRef(null);
  const [value, setValue] = useState('');
  const { user: userStore } = useStores();

  const profileImageUrl = userStore?.userInfo?.productImageUrl;
  console.log('mention : ', mention);

  useEffect(() => {
    if (mention) setValue(' ');
  }, [mention]);

  useEffect(() => {
    if (!value) onClearMention();
  }, [value]);

  const onClickEmoji = (emoji) => setValue(value + emoji);
  const changeTextarea = (text) => {
    setValue(text);
    textarea.current.style.height = '17px';
    textarea.current.style.height = textarea.current.scrollHeight + 'px';
  };

  return (
    <Wrapper>
      {/* 이모티콘 선택 리스트 */}
      <EmojiSection>
        {REVIEW_EMOJI_LIST.length
          ? REVIEW_EMOJI_LIST.map((v) => (
              <Emoji symbol={v} onClickEmoji={onClickEmoji} />
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
            <TextDiv>
              <Text
                ref={textarea}
                wrap={'physical'}
                placeholder={'댓글을 입력해주세요.'}
                onChange={(e) => changeTextarea(e.target.value)}
                value={value}
              />
            </TextDiv>
            <SubmitDiv>
              <Submit
                onClick={() => {
                  setValue('');
                  onClickCommentSubmit(value);
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

import styled from 'styled-components';

export const Wrapper = styled.div`
  font-family: Roboto;
`;

export const Title = styled.div`
  font-size: 15px;
  font-weight: bold;
  line-height: 2;
  margin-bottom: 20px;
  &::before {
    content: '댓글 ';
  }
`;

export const Contents = styled.div`
  > div {
    margin-bottom: 16px;
  }

  > div:last-child {
    margin-bottom: 0;
  }
`;

export const ContentItem = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

export const Avatar = styled.div`
  width: 30px;
  margin-right: 10px;
`;

export const Comment = styled.div`
  font-family: Roboto;
  width: calc(100% - 40px);
`;

export const CommentName = styled.div`
  font-size: 13px;
  font-weight: bolder;
  line-height: 1.29;
  margin-bottom: 5px;
`;

export const CommentContents = styled.div`
  font-size: 13px;
  margin-bottom: 6px;
`;

export const CommentInfo = styled.div`
  color: #999999;
  font-size: 12px;
`;

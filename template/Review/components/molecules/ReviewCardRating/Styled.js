import styled from 'styled-components';

/**
 * Layout
 */
export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  height: 56px;

  > div {
    width: 50%;
  }
`;

export const LikeAndCommentSection = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 600;
`;

export const LikeSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 7px;
`;

export const CommentSection = styled.div`
  display: flex;
  align-items: center;
  margin: 0 7px;
`;

export const StarSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

/**
 * Components
 */
export const Counter = styled.div`
    margin-left: 7px;
`;

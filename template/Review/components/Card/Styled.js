import styled from 'styled-components';

export const Wrapper = styled.div``;

export const CardImageSection = styled.div`
  height: 320px;
`;

export const CardImageSectionItem = styled.div`
  margin: 0 20px;
`;

export const CardInfoSection = styled.div``;

// 좋아요 & 댓글, 별점
export const CardInfoRatingSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 20px;
  height: 56px;

  > div {
    width: 50%;
  }

  /* stars */
  > div:last-child {
    display: flex;
    justify-content: flex-end;
  }
`;

export const CardInfoLikeAndComment = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 600;

  > div {
    display: flex;
    align-items: center;
    margin-right: 7px;

    > div:last-child {
      margin-left: 7px;
    }
  }
`;

// 본문 영역
export const CardContentsSection = styled.div`
  font-family: Roboto;
  font-size: 13px;
  line-height: 1.38;
  margin: 0 20px;
  height: 36px;
  overflow: hidden;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  > .nick-name {
    font-weight: bold;
  }
  > .contents {
    font-weight: 400;
  }
  > .more {
    color: #999999;
  }
`;

export const CardProductSection = styled.div`
  font-family: Roboto;
  height: 70px;
  margin: 15px 20px 0 20px;
  border: 1px solid #eeeeee;
  line-height: 1.38;
  display: flex;
  align-items: center;

  > div {
    height: 100%;
  }

  > div:first-child {
    width: 90px;
    padding: 10px 20px;
  }

  > div:last-child {
    width: 228px;
    height: 35px;
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    > div {
      width: 100%;
    }

    > .nick-name {
      font-weight: bold;
      padding-bottom: 5px;
    }
    > .contents {
      font-weight: 400;
    }
  }
`;

export const Divider = styled.div`
  height: 8px;
  margin: 30px 0;
  background-color: #f9f9fa;
`;

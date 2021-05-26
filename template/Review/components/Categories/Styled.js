import styled from 'styled-components';

export const ReviewCategoryWrapper = styled.div`
  font-family: Roboto;
  font-weight: 500;
  margin: 30px 20px;
  height: 100%;
`;

export const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 15px;
`;

export const Contents = styled.div`
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  margin-bottom: 30px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ContentItem = styled.div`
  width: 54px;
  margin-right: 15px;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
`;

export const CategoryImage = styled.div`
  width: 54px;
  height: 54px;
  margin-bottom: 15px;
`;

export const CategoryText = styled.div`
  font-size: 12px;
  line-height: 1.6;
  &.active {
    color: #444;
  }
  &.inActive {
    color: #777;
  }
`;

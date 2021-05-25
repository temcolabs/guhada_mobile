import styled from 'styled-components';

export const Wrapper = styled.div`
  overflow: hidden;
`;

export const SliderWrapper = styled.div`
  .slick-slide {
    padding: ${(props) => (props.type === 'FOCUS_ON' ? '0 10px' : '')};
  }
  .slick-dots {
    bottom: ${(props) =>
      props.type === 'FOCUS_ON' ? props.bottom + 'px' : '0px'};
  }
`;

export const TitleSection = styled.div`
  font-family: NanumSquare-Bold;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 138px;
`;

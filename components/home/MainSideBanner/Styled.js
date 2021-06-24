import styled from 'styled-components';

export const Wrapper = styled.div`
  overflow: hidden;
`;

export const SliderWrapper = styled.div`
  position: relative;
  ${(props) => props.type === 'FOCUS_ON' && 'height: calc((16 / 15) * 100vw);'}

  .slick-slide {
    ${(props) => props.type === 'FOCUS_ON' && 'padding: 0 10px;'}
  }
  .slick-dots {
    position: absolute;
    height: 30px;
    ${(props) => (props.type === 'FOCUS_ON' ? 'top: -45px' : 'bottom: 0')};
  }

  .slider-wrap {
    height: 100%;

    img {
      display: block;
      margin: 0 auto;
    }
  }
`;

export const TitleSection = styled.div`
  font-family: 'NanumSquare';
  font-size: 20px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 138px;
`;

import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 315px;
  margin-top: 40px;
  position: relative;
`;

export const SectionImage = styled.div`
  width: 260px;
  height: 260px;
  background-image: url(${(props) => props.imageUrl});
  background-size: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${(props) => (props.zIndex ? props.zIndex : 0)};
`;

export const SectionBg = styled.div`
  height: 170px;
  background-color: #f8f8f8;
  position: relative;
  top: 145px;
`;


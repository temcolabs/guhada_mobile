import styled from 'styled-components';

export const ImageDiv = styled.div`
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${(props) => (props.size ? props.size : 'cover')};
  width: 100%;
  height: 100%;
`;

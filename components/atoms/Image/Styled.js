import styled from 'styled-components';

export const ImageDiv = styled.div`
  background-color: ${(props) => props.backgroundColor};
  background-image: ${(props) => `url(${props.src})`};
  background-position: center;
  background-repeat: no-repeat;
  background-size: ${(props) => (props.size ? props.size : 'cover')};
  width: ${(props) => (props.width ? props.width : '100%')};
  height: ${(props) => (props.height ? props.height : '100%')};
`;

import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 320px;
`;

export const ImageSection = styled.div`
  margin: ${(props) => (props.type === 'list' ? '0 20px' : '0')};
`;

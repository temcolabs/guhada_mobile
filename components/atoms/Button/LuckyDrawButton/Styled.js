import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  height: 63px;
  border-radius: 5px;
  background-color: ${props => (props.isActive ? '#232323' : '#ccc')};
  color: #fff;
`;

export { Button };

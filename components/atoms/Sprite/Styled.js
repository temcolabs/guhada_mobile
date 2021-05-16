import styled from 'styled-components';
import json from 'styles/sprite.json';

const sprites = JSON.parse(json);

export const Sprite = styled.div`
  background-image: url(
    ${props => props.url}
  );
  background-position: ${props => props.x} ${props => props.y};
  width: ${props => props.width};
  height: ${props => props.height};
`;
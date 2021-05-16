import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Sprite } from './Styled';

const sprites = JSON.parse(json);
// TODO : dash 확인

/**
 * Extract sprite image component
 * @param {String} name, name of sprite 
 * @returns 
 */
function Sprite({ name }) {
  return (
    sprites[name] ?
      <Sprite url={sprites[name].image}
        x={sprites[name].px.x}
        y={sprites[name].px.y}
        width={sprites[name].px.width}
        height={sprites[name].px.height}
      /> : ''
  )
}

Sprite.propTypes = {
  name: PropTypes.string.isRequired
}

export default Sprite


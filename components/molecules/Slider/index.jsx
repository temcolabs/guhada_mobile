import React from 'react';
import ReactSlider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import PropTypes from 'prop-types';

/**
 * React slick
 * @description https://react-slick.neostack.com/
 * @param {Element} children : Child elements
 * @param {Object} settings : Settings 
 * @returns 
 */
function Slider({ children, settings }) {
  return <ReactSlider {...settings}>{children}</ReactSlider>;
}

Slider.propTypes = {
  children: PropTypes.element.isRequired,
  settings: PropTypes.object.isRequired,
};

export default Slider;

import { useState } from 'react';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

const LazyPlaceholderImage = ({ imageSrc, placeholderSrc, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={className}>
      <LazyLoad>
        <img
          src={imageSrc}
          placeholder={placeholderSrc}
          alt={alt}
          onLoad={() => {}}
        />
      </LazyLoad>
    </div>
  );
};

LazyPlaceholderImage.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  placeholderSrc: PropTypes.string,
  alt: PropTypes.string,
};

export default LazyPlaceholderImage;

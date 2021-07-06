import css from './ThumbnailButton.module.scss';
import { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const ThumbnailButton = ({ thumbnail, setThumbnail }) => (
  <div className={css['thumbnail-button']}>
    <div
      className={cn(
        'misc',
        thumbnail === 0 ? 'thumbnail-quad--on' : 'thumbnail-quad'
      )}
      onClick={() => setThumbnail(0)}
    />
    <div
      className={cn(
        'misc',
        thumbnail === 1 ? 'thumbnail-double--on' : 'thumbnail-double'
      )}
      onClick={() => setThumbnail(1)}
    />
    <div
      className={cn(
        'misc',
        thumbnail === 2 ? 'thumbnail-hex--on' : 'thumbnail-hex'
      )}
      onClick={() => setThumbnail(2)}
    />
  </div>
);

ThumbnailButton.propTypes = {
  thumbnail: PropTypes.number,
  setThumbnail: PropTypes.func,
};

export default memo(ThumbnailButton);

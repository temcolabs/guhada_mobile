import css from './ThumbnailButton.module.scss';
import { memo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';

const ThumbnailButton = ({ thumbnail, setThumbnail }) => (
  <div className={css['thumbnail-button']}>
    <div
      className={cn(
        css['thumbnail--quad'],
        thumbnail === 0 && css['thumbnail--selected']
      )}
      onClick={() => setThumbnail(0)}
    />
    <div
      className={cn(
        css['thumbnail--double'],
        thumbnail === 1 && css['thumbnail--selected']
      )}
      onClick={() => setThumbnail(1)}
    />
    <div
      className={cn(
        css['thumbnail--hex'],
        thumbnail === 2 && css['thumbnail--selected']
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

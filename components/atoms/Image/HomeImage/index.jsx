import css from './Image.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';

const Image = ({ src, backgroundColor, padding, onClick }) => (
  <div
    style={{ backgroundColor }}
    className={cn(css['image'], padding && css['padding'])}
    onClick={onClick}
  >
    <img src={src} />
  </div>
);

Image.propTypes = {
  src: PropTypes.string,
  backgroundColor: PropTypes.string,
  padding: PropTypes.bool,
  handleClick: PropTypes.func,
};

export default Image;

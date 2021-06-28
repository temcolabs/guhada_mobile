import css from './Image.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';

const Image = ({ src, backgroundColor, fixedHeight, onClick }) => (
  <div
    style={{ backgroundColor, backgroundImage: fixedHeight && `url('${src}')` }}
    className={cn(css['image'], fixedHeight && css['fixed-height'])}
    onClick={onClick}
  >
    {!fixedHeight && <img src={src} />}
  </div>
);

Image.propTypes = {
  src: PropTypes.string,
  backgroundColor: PropTypes.string,
  handleClick: PropTypes.func,
};

export default Image;

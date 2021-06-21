import css from './Banner.module.scss';
import PropTypes from 'prop-types';

const Banner = ({ dataList }) => {
  return <div className={css['banner']} />;
};

Banner.propTypes = {
  dataList: PropTypes.any,
};

export default Banner;

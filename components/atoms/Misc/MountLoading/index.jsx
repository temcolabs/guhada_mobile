import css from './MountLoading.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';

const MountLoading = ({ gutter }) => (
  <div className={cn(css['loading'], gutter && css['gutter'])}>
    <div className={css['loading__wrap']}>
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
      <div className={css['stroke']} />
    </div>
  </div>
);

MountLoading.propTypes = {
  guttter: PropTypes.bool,
};

export default MountLoading;

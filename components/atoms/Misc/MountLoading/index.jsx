import css from './MountLoading.module.scss';

const MountLoading = () => (
  <div className={css['loading']}>
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

export default MountLoading;

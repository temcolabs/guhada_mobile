import css from './Spinner.module.scss';

const Spinner = () => (
  <div className={css.spinnerWrapper}>
    <div className={css.spinner} />
  </div>
);

export const SpinnerDiv = () => (
  <div className={css.spinnerDiv}>
    <div className={css.spinner} />
  </div>
);

export default Spinner;

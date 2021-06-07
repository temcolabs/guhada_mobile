import css from './Spinner.module.scss';

const Spinner = () => {
  return (
    <div className={css.spinnerWrapper}>
      <div className={css.spinner} />
    </div>
  );
};

export const SpinnerDiv = () => {
  return (
    <div className={css.spinnerDiv}>
      <div className={css.spinner} />
    </div>
  );
};

export default Spinner;

import css from './Spinner.module.scss';

const Spinner = () => {
  return (
    <div className={css.spinnerWrapper}>
      <div className={css.spinner}>Loading</div>
    </div>
  );
};

export default Spinner;

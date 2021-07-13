import css from './ModalForm.module.scss';

export default function ModalFormSubmit({
  cancelButtonText = '취소',
  submitButtonText = '확인',
  onCancel = () => {},
  onSubmit = () => {},
}) {
  return (
    <div className={css.submitButtons}>
      <button type="button" onClick={onCancel}>
        {cancelButtonText}
      </button>
      <button type="submit" onClick={onSubmit}>
        {submitButtonText}
      </button>
    </div>
  );
}

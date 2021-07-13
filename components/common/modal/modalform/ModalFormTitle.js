import css from './ModalForm.module.scss';

export default function ModalFormTitle({
  children, // 타이틀
  onClose, // 모달 닫기
  isCloseButtonHidden = false,
  wrapperStyle = {},
}) {
  return (
    <div className={css.title} style={wrapperStyle}>
      {children}

      {!isCloseButtonHidden && (
        <button className={css.title__closeButton} onClick={onClose} />
      )}
    </div>
  );
}

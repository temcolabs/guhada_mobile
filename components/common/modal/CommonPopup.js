import ModalWrapper from './ModalWrapper';
import css from './CommonPopup.module.scss';
export default function CommonPopup({
  isOpen = false,
  cancelButtonText = '취소',
  submitButtonText = '확인',
  onCancel = () => {},
  onSubmit = () => {},
  backgroundImage = '',
}) {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={() => {}}
      contentStyle={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'transparent',
      }}
      zIndex={1000}
    >
      <div className={css.wrap}>
        <div
          className={css.imageWrap}
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        <div className={css.buttonWrap}>
          <button onClick={() => onSubmit()}>{submitButtonText}</button>
          <button onClick={() => onCancel()}>{cancelButtonText}</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

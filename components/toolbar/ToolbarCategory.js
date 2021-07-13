import css from './ToolbarCategory.module.scss';
import ModalPortal from 'components/templates/ModalPortal';
import Category from './Category';

export default function ToolbarCategory({ onClose }) {
  return (
    <div>
      <ModalPortal handleClose={onClose} slide={1} gutter>
        <div className={css.wrap}>
          <div className={css.header}>카테고리</div>
          <div className={css.itemWrap}>
            <Category onClose={onClose} />
          </div>
        </div>
      </ModalPortal>
    </div>
  );
}

import css from './OptionQuantity.module.scss';
import { observer } from 'mobx-react';

const OptionQuantity = observer(
  ({ productoption, sizeGuideModalOpenhandler, sizeImageUrl }) => {
    return (
      <>
        {productoption.options.selectedOption ? (
          <div className={css.quantity__wrap}>
            <div className={css.quantity__section}>
              <div className={css.option__quantity}>
                <div
                  className={css.minus__btn}
                  onClick={() => {
                    productoption.quantityMinus();
                  }}
                >
                  <img
                    src={productoption.quantityMinusBtn}
                    alt="minus button"
                  />
                </div>
                <div className={css.quantity}>
                  <input
                    value={productoption.options.selectedQuantity}
                    onChange={(e) => {
                      productoption.quantityChange(e);
                    }}
                    onBlur={(e) => {
                      productoption.quantityChangeOutFocus(e);
                    }}
                  />
                </div>
                <div
                  className={css.plus__btn}
                  onClick={() => {
                    productoption.quantityPlus();
                  }}
                >
                  <img src={productoption.quantityPlusBtn} alt="plus button" />
                </div>
              </div>

              {productoption.options.selectedOption.stock > 10 ? null : (
                <div className={css.option__stock}>
                  {productoption.options.selectedOption
                    ? productoption.options.selectedOption.stock
                    : null}{' '}
                  개 남음
                </div>
              )}
            </div>
            {sizeImageUrl && (
              <div
                className={css.option__sizeGuide}
                onClick={sizeGuideModalOpenhandler}
              >
                사이즈정보
              </div>
            )}
          </div>
        ) : null}

        <div className={css.selected__option__pirce}>
          <div className={css.total__price__text}>총 상품금액</div>

          <div className={css.total__price}>
            <span className={css.opiton__price}>
              {productoption.options.selectedOption
                ? productoption.options.selectedOption.price === 0
                  ? null
                  : productoption.options.selectedOpitonPrice
                : null}
            </span>
            <span>{productoption.options.selectedTotalPrice}</span>
            <span className={css.total__price__won}>원</span>
          </div>
        </div>
      </>
    );
  }
);

export default OptionQuantity;

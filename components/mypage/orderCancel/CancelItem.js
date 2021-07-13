import css from './CancelItem.module.scss';

/**
 * 취소 완료 페이지에 표시되는 상품 정보
 */
export default function CancelItem({ order = {} }) {
  const hasOrderOption =
    order?.optionAttribute1 ||
    order?.optionAttribute2 ||
    order?.optionAttribute3;
  return (
    <div className={css.wrapper}>
      {/* 상품 이미지 */}
      <div
        className={css.productImageBox}
        style={{
          backgroundImage: `url(${order?.imageUrl})`,
        }}
      />

      {/* 상품 정보 */}
      <div className={css.productInfo}>
        <div className={css.productInfo__upperArea}>
          <div className={css.prodName}>
            <b>[{order?.brandName}]</b> {order?.prodName}
          </div>
          {hasOrderOption && (
            <div className={css.options}>
              <span>구매옵션 &nbsp;&nbsp;&nbsp;</span>
              {order?.optionAttribute1 && (
                <span>{order?.optionAttribute1}</span>
              )}
              {order?.optionAttribute2 && (
                <span>, {order?.optionAttribute2}</span>
              )}
              {order?.optionAttribute3 && (
                <span>, {order?.optionAttribute3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

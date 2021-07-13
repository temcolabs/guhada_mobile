import css from './SectionItem.module.scss';
import cn from 'classnames';
import isTruthy from 'lib/common/isTruthy';
import brandNew from 'lib/constant/filter/brandNew';
import LazyLoad from 'react-lazyload';

export default function SectionItem({
  item = {
    brandId: 592,
    brandName: 'JAMESPERSE',
    categoryId: 234,
    dealId: 2733,
    dealName: 'JAMESPERSE 여성 의류 바지 플레어 팬츠 no.2555 상품 by.SP',
    discountPrice: 0,
    discountRate: 0,
    freeShipping: true,
    productImage: [
      {
        height: 275,
        name: 'nike_air_max_97_safety_orange.jpeg',
        url:
          'https://d3ikprf0m31yc7.cloudfront.net/images/products/thumb/a5e85e5d916e4e1e9d78d0a5e75a7411',
        width: 183,
      },
    ],
    options: [
      { type: '', attributes: [''] },
      { type: '', attributes: [''] },
      { type: '', attributes: [''] },
    ],
    productId: 0,
    productName: '',
    productSeason: '',
    searchField: '',
    sellPrice: 0,
    sellerId: 0,
    sellerName: '',
    setDiscount: false,
  },
  sellerStore = false,
  likeItemDelete = () => {},
  Shape = '',
}) {
  return (
    <div className={css.wrap}>
      <div className={css.imageWrap}>
        {/* AS-IS : 상단 무료 배송 Label */}
        {/* {item.freeShipping === true || item.freeShippingText === 'FREE' ? (
          Shape === 'main' ? null : (
            <div className={css.freeShipping}>
              무료
              <br />
              배송
            </div>
          )
        ) : null} */}
        {item.soldOut && <div className={css.soldOut}>SOLDOUT</div>}
        {item?.productImage?.url && (
          <LazyLoad>
            <img
              src={item.productImage.url + '?w=375'}
              alt={item.productImage.name}
            />
          </LazyLoad>
        )}
        {isTruthy(likeItemDelete) && (
          <div
            className={css.item__delete__btn}
            onClick={(e) => {
              e.preventDefault();
              likeItemDelete(e, item.productId);
            }}
          />
        )}
      </div>
      <div className={css.contentWrap}>
        {_.isEmpty(item.brandNew) && (
          <div className={css.conditionWrap}>
            {/* TODO : 해외배송 하단 라벨 */}
            {/* {item.internationalShipping && (
              <>
                <div className={css.internationalShipping}>
                  {item.internationalShipping &&
                    internationalShipping.INTERNATIONAL}
                </div>
                {!item.brandNew && <div className={css.betweenLine} />}
              </>
            )} */}

            <div className={cn(css.brandNew, { [css.new]: item.brandNew })}>
              {item.brandNew ? '' : brandNew.USED}
            </div>
          </div>
        )}
        <div className={css.brandWrap}>
          <div className={css.brandName}>{item.brandName}</div>
          {/* <div className={css.productSeason}>{item.productSeason}</div> */}
        </div>
        <div className={css.dealName}>{item.dealName}</div>
        {item.discountRate > 0 ? (
          <div className={css.priceWrap}>
            <div>
              <span className={css.sellPrice}>
                {item.discountPrice?.toLocaleString()}
              </span>
              <span className={css.discountPrice}>
                {item.sellPrice !== 0 ? item.sellPrice?.toLocaleString() : null}
              </span>
            </div>
            <div>
              <span className={css.discountRate}>
                {item.discountRate !== 0 ? `${item.discountRate}%` : null}
              </span>
            </div>
          </div>
        ) : (
          <div className={css.priceWrap}>
            <span className={css.sellPrice}>
              {`${item.sellPrice.toLocaleString()}`}
            </span>
          </div>
        )}
        <div className={css.shipWrap}>
          <span className={css.shipItem}>
            {item.internationalShipping ? '해외배송' : '국내배송'}
          </span>
          <span className={css.shipItem}>
            {item.freeShipping ? '무료배송' : '유료배송'}
          </span>
        </div>
        {/* AS-IS : 셀러 정보 */}
        {/* {sellerStore === false && (
          <div className={css.sellerWrap}>
            <div className={css.sellerLevel}>
            <div className={css.level}>{1}</div>
          </div>
            <span className={css.sellerName}>{item.sellerName}</span>
          </div>
        )} */}
      </div>
    </div>
  );
}

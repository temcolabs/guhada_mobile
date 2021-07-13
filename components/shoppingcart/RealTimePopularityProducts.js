import { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './RealTimePopularityProducts.module.scss';
import Link from 'next/link';
@inject('shoppingcart')
@observer
class RealTimePopularityProducts extends Component {
  render() {
    let { shoppingcart } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>실시간 인기상품</div>
        <ul className={css.productWrap}>
          {shoppingcart.realTimePopularityProducts.map((data, index) => {
            return (
              <Link href={`/productdetail?deals=${data.dealId}`} key={index}>
                <li className={css.productItem}>
                  <div
                    className={css.productItemImage}
                    style={{
                      backgroundImage: `url('${data.imageUrl}')`,
                    }}
                  />
                  <div className={css.brandName}>{data.brandName}</div>
                  <div className={css.productName}>{data.productName}</div>
                </li>
              </Link>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default RealTimePopularityProducts;

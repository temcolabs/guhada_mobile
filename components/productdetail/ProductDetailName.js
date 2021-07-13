import { Component } from 'react';
import dynamic from 'next/dynamic';
import css from './ProductDetailName.module.scss';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import copy from 'copy-to-clipboard';
import Router from 'next/router';
import { sendBackToLogin } from 'lib/router';
import { LoadingSpinner } from 'components/common/loading/Loading';

/**
 * Lazy UserClaimModal
 */
const DynamicBlockChainModal = dynamic(
  () => import('components/productdetail/Modals/BlockChainModal'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

@inject(
  'productdetail',
  'productDetailBookmark',
  'productoption',
  'alert',
  'searchitem',
  'login'
)
@observer
class ProductDetailName extends Component {
  state = {
    isBlockChainModal: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.router?.query, this.props.router?.query)) {
      this.props.productDetailBookmark.productBookmarkInit();
    }
  }

  componentWillUnmount() {
    this.props.productDetailBookmark.productBookmarkInit();
  }

  handleBlockChainModal = () => {
    this.setState({ isBlockChainModal: true });
  };

  copyUrlToClipboard = () => {
    const productUrl = `${window.location.protocol}//${window.location.host}${Router.router.asPath}`;

    copy(productUrl);
    this.props.alert.showAlert('상품 URL이 클립보드에 복사되었습니다.');
  };

  render() {
    let {
      productdetail,
      productDetailBookmark,
      searchitem,
      login,
    } = this.props;
    let { deals } = productdetail;
    return (
      <>
        {this.state.isBlockChainModal ? (
          <DynamicBlockChainModal
            isModalOpen={this.state.isBlockChainModal}
            onCloseModal={() => this.setState({ isBlockChainModal: false })}
            deals={deals}
          />
        ) : (
          ''
        )}
        <div className={css.wrap}>
          <div className={css.inner__top}>
            <div
              className={css.brandName}
              onClick={() =>
                searchitem.toSearch({ brand: deals.brandId, enter: 'brand' })
              }
            >
              {deals.brandName}
              <span className={css.arrow} />
            </div>
            <div className={css.detail__number}>상품번호 {deals.dealId}</div>
          </div>

          <div className={css.inner__middle}>
            <div className={css.product__name}>
              {`${_.isNil(deals.season) === false ? deals.season : ''} ${
                deals.name
              }`}
            </div>
          </div>

          <div className={css.inner__bottom}>
            <div className={css.product__price__wrap}>
              {/* Price */}
              <div className={css.product__discount__price}>
                {deals.discountPrice.toLocaleString()}
              </div>
            </div>
            {/* Icons */}
            <div className={css.utility__wrap}>
              {deals.trackRecords && deals.trackRecords.length ? (
                <div onClick={this.handleBlockChainModal}>
                  <img
                    src="/public/icon/icon_blockchain_link_black.png"
                    alt="블록체인정보"
                  />
                </div>
              ) : (
                ''
              )}
              <div className={css.share__btn} onClick={this.copyUrlToClipboard}>
                <img src="/public/icon/m_share_btn.png" alt="공유하기" />
              </div>
              <div
                className={css.like__btn}
                onClick={() => {
                  if (login.isLoggedIn) {
                    productDetailBookmark.saveBookmark(deals.productId);
                  } else {
                    sendBackToLogin();
                  }
                }}
              >
                {productDetailBookmark.bookMarkStatus ? (
                  <img src="/public/icon/m_like_btn_on.png" alt="북마크" />
                ) : (
                  <img src="/public/icon/m_like_btn_off.png" alt="북마크" />
                )}
              </div>
            </div>
          </div>
          {/* Discounts info */}
          <div className={css.inner__discounts}>
            {deals.discountPrice === deals.sellPrice ? null : (
              <div className={css.product__sell__price}>
                {deals.sellPrice.toLocaleString()}
              </div>
            )}
            {deals.discountPrice === deals.sellPrice ? null : (
              <div className={css.product__discount__rate}>
                {`${deals.discountRate}%`}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default ProductDetailName;

import React from 'react';
import { withRouter } from 'next/router';
import Gallery from 'components/productdetail/Gallery';
import ProductDetailName from 'components/productdetail/ProductDetailName';
import ProductDetailOption from 'components/productdetail/ProductDetailOption';
import CartAndPurchaseButton from 'components/productdetail/CartAndPurchaseButton';
import ShippingBenefit from 'components/productdetail/ShippingBenefit';
import ProductTab from 'components/productdetail/ProductTab';
import ProductDetailContents from 'components/productdetail/ProductDetailContents';
import Tag from 'components/productdetail/Tag';
import ItemWrapper from 'components/productdetail/ItemWrapper';
import { inject, observer } from 'mobx-react';
import ProductInfo from 'components/productdetail/ProductInfo';
import { SeparateLine } from 'components/productdetail/SeparateLine';
import FoldedWrapper from 'components/productdetail/FoldedWrapper';
import ShippingReturn from 'components/productdetail/ShippingReturn';
import ProductNotifie from 'components/productdetail/ProductNotifie';
import SectionWrap from 'components/productdetail/SectionWrap';
import RelatedAndRecommend from 'components/productdetail/RelatedAndRecommend';
import SellerStoreInfo from 'components/productdetail/SellerStoreInfo';
import ProductInquiry from 'components/productdetail/ProductInquiry/ProductInquiry';
import ProductReview from 'components/productdetail/ProductReview/ProductReview';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import Coupon from 'components/productdetail/Coupon';
import _ from 'lodash';
import CommonPopup from 'components/common/modal/CommonPopup';
import SellerReview from 'components/productdetail/SellerReview/SellerReview';
import LoadingPortal from 'components/common/loading/Loading';
import { sendBackToLogin } from 'childs/lib/router';

import AppLinkPopup from 'components/event/popup/AppLinkPopup';
import localStorage from 'childs/lib/common/localStorage';

@withScrollToTopOnMount
@inject(
  'searchitem',
  'productoption',
  'sellerfollow',
  'productdetail',
  'login',
  'alert',
  'mypageRecentlySeen',
  'cartAndPurchase',
  'login',
  'shoppingCartSuccessModal'
)
@observer
class ProductDetail extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      isInternationalPopup: false,
      isInternationalSubmit: '',
      cartAndPurchaseVisible: true,
      isDeepLinkModalOn: false,
    };
    this.tabRefMap = {
      detailTab: React.createRef(),
      inquiryTab: React.createRef(),
      sellerstoreTab: React.createRef(),
      reviewTab: React.createRef(),
    };
  }

  componentDidMount() {
    if (!localStorage.get('isDeepLinkModalOff')) {
      this.setState({ isDeepLinkModalOn: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //  최근 본 상품에 현재 아이템 추가
    const isDealsFetched =
      _.get(this, 'props.productdetail.deals.dealsId') !==
      _.get(this, 'prevProps.productdetail.deals.dealsId');

    if (isDealsFetched) {
      this.props.mypageRecentlySeen.addItem(this.props.productdetail.deals);
    }
  }

  handleSellerFollows = () => {
    const { sellerfollow, productdetail, login } = this.props;
    const follows = sellerfollow.follows;
    if (login.isLoggedIn) {
      if (follows === false) {
        sellerfollow.setSellerFollow(productdetail.deals.sellerId);
      } else if (follows === true) {
        sellerfollow.deleteSellerFollow(productdetail.deals.sellerId);
      }
    } else {
      sendBackToLogin();
    }
  };

  handleInternationalPopup = (bool) => {
    this.setState({
      isInternationalPopup: bool,
    });
  };

  isInternationalSubmit = (text) => {
    this.setState({ isInternationalSubmit: text });
  };

  submitInternationalPopup = () => {
    const { cartAndPurchase } = this.props;
    if (this.state.isInternationalSubmit === 'addShoppingCart') {
      cartAndPurchase.addShoppingCart();
    } else if (this.state.isInternationalSubmit === 'immediatePurchase') {
      cartAndPurchase.immediatePurchase();
    }
    this.setState({
      isInternationalPopup: false,
    });
  };

  /**
   * handle cart and pucrach button visible or not from 상품 문의 visible or not
   */
  CartAndPurchaseButtonHandler = (value) => {
    this.setState({
      cartAndPurchaseVisible: !value,
    });
  };

  render() {
    const {
      deals,
      tags,
      claims,
      businessSeller,
      seller,
      dealsOfSameBrand,
      dealsOfRecommend,
      dealsOfSellerStore,
      followers,
      satisfaction,
      productoption,
      sellerfollow,
      productdetail,
      login,
      alert,
      searchitem,
      shoppingCartSuccessModal,
    } = this.props;

    return (
      <>
        {/* 상세이미지갤러리 */}
        <Gallery />

        {/* 상세 상품 정보 */}
        <ProductDetailName />

        {/* 쿠폰  */}
        <Coupon />

        {/* 상세 상품 옵션 */}
        <ProductDetailOption />

        {/* 배송 정보 및 해택, 셀러 기본정보 */}
        <ShippingBenefit
          deals={deals}
          satisfaction={satisfaction}
          sellerData={seller}
          shipExpenseType={productoption.shipExpenseType}
          tabRefMap={this.tabRefMap}
          sellerStore={productdetail.sellerStore}
        />

        {/* 상세정보, 상품문의, 셀러스토어 탭 */}
        <ProductTab tabRefMap={this.tabRefMap} />

        {/* 상품 상세 내용 */}
        <ProductDetailContents deals={deals} tabRefMap={this.tabRefMap} />

        {/* 상품 태그 */}
        <ItemWrapper header={'태그'}>
          <Tag tags={tags} toSearch={searchitem.toSearch} />
        </ItemWrapper>

        {/* 상품 정보, 소재 */}
        <ItemWrapper header={'상품 정보'}>
          <ProductInfo deals={deals} />
        </ItemWrapper>
        {SeparateLine}

        {/* 상품 리뷰 */}
        <ProductReview tabRefMap={this.tabRefMap} />
        {SeparateLine}

        {/* 셀러 리뷰 */}
        <SellerReview />
        {SeparateLine}

        {/* 상품 문의 */}
        <SectionWrap>
          <ProductInquiry
            tabRefMap={this.tabRefMap}
            isNewInquiryVisible={this.CartAndPurchaseButtonHandler}
          />
        </SectionWrap>
        {SeparateLine}

        {/* 배송/반품/교환정보, 판매자 정보*/}
        <FoldedWrapper header={'배송/반품/교환정보'}>
          <ShippingReturn
            deals={deals}
            claims={claims}
            businessSeller={businessSeller}
            seller={seller}
            shipExpenseType={productoption.shipExpenseType}
            sellerStore={productdetail.sellerStore}
          />
        </FoldedWrapper>
        {SeparateLine}
        {/* 상품고시정보 */}
        {deals.productNotifies ? (
          <FoldedWrapper header={'상품고시정보'} noline={true}>
            <ProductNotifie productNotifies={deals.productNotifies} />
          </FoldedWrapper>
        ) : null}

        {SeparateLine}
        {/* 판매자의 연관상품, 추천상품 */}
        <RelatedAndRecommend
          dealsOfSameBrand={dealsOfSameBrand}
          dealsOfRecommend={dealsOfRecommend}
        />
        {SeparateLine}
        {/* 셀러스토어 */}
        <SectionWrap style={{ paddingBottom: '60px' }}>
          <SellerStoreInfo
            deals={deals}
            dealsOfSellerStore={dealsOfSellerStore}
            followers={followers}
            sellerData={seller}
            tabRefMap={this.tabRefMap}
            handleSellerFollows={this.handleSellerFollows}
            sellerfollow={sellerfollow}
            login={login}
            alert={alert}
            sellerStore={productdetail.sellerStore}
          />
        </SectionWrap>

        {/* 상품 상세 장바구니 , 구매하기 버튼 */}
        {this.state.cartAndPurchaseVisible === true &&
          !shoppingCartSuccessModal.isOpen && (
            <CartAndPurchaseButton
              isVisible={false}
              handleInternationalPopup={this.handleInternationalPopup}
              isInternationalSubmit={this.isInternationalSubmit}
            />
          )}

        {this.state.isInternationalPopup && (
          <CommonPopup
            isOpen={this.state.isInternationalPopup}
            backgroundImage={`${
              process.env.API_CLOUD
            }/images/web/common/notice_delivery@3x.png`}
            cancelButtonText={'취소'}
            submitButtonText={'동의'}
            onCancel={() => {
              this.handleInternationalPopup(false);
            }}
            onSubmit={() => {
              this.submitInternationalPopup();
            }}
          />
        )}

        {/* {this.state.isDeepLinkModalOn && (
          <AppLinkPopup
            handleClose={() => this.setState({ isDeepLinkModalOn: false })}
          />
        )} */}

        {this.props.cartAndPurchase.addCartStatus && <LoadingPortal />}
      </>
    );
  }
}

export default withRouter(ProductDetail);

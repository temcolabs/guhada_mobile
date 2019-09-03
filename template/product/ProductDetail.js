import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
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

@inject('searchitem', 'productoption')
@observer
class ProductDetail extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

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
    } = this.props;

    return (
      <DefaultLayout
        topLayout={'main'}
        pageTitle={null}
        toolBar={false}
        headerShape={'productDetail'}
      >
        {/* 상세이미지갤러리 */}
        <Gallery />

        {/* 상세 상품 정보 */}
        <ProductDetailName />

        {/* 상세 상품 옵션 */}
        <ProductDetailOption />

        {/* 상품 상세 장바구니 , 구매하기 버튼 */}
        <CartAndPurchaseButton />

        {/* 배송 정보 및 해택, 셀러 기본정보 */}
        <ShippingBenefit
          deals={deals}
          satisfaction={satisfaction}
          seller={seller}
          shipExpenseType={productoption.shipExpenseType}
        />

        {/* 상세정보, 상품문의, 셀러스토어 탭 */}
        <ProductTab />

        {/* 상품 상세 내용 */}
        <ProductDetailContents />

        {/* 상품 태그 */}
        <ItemWrapper header={'태그'}>
          <Tag tags={tags} />
        </ItemWrapper>

        {/* 상품 정보, 소재 */}
        <ItemWrapper header={'상품 정보'}>
          <ProductInfo deals={deals} />
        </ItemWrapper>
        {SeparateLine}

        {/* 상품 리뷰 */}
        <ProductReview />
        {SeparateLine}
        {/* 상품 문의 */}
        <SectionWrap>
          <ProductInquiry />
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
        <SectionWrap>
          <RelatedAndRecommend
            dealsOfSameBrand={dealsOfSameBrand}
            dealsOfRecommend={dealsOfRecommend}
          />
        </SectionWrap>
        {SeparateLine}
        {/* 셀러스토어 */}
        <SectionWrap>
          <SellerStoreInfo
            deals={deals}
            dealsOfSellerStore={dealsOfSellerStore}
            followers={followers}
            seller={seller}
          />
        </SectionWrap>
      </DefaultLayout>
    );
  }
}

export default ProductDetail;

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

@inject('searchitem')
@observer
class ProductDetail extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { deals, tags } = this.props;

    return (
      <DefaultLayout pageTitle={'상품-상세페이지'} toolBar={false}>
        {/* 상세이미지갤러리 */}
        <Gallery />

        {/* 상세 상품 정보 */}
        <ProductDetailName />

        {/* 상세 상품 옵션 */}
        <ProductDetailOption />

        {/* 상품 상세 장바구니 , 구매하기 버튼 */}
        <CartAndPurchaseButton />

        {/* 배송 정보 및 해택, 셀러 기본정보 */}
        <ShippingBenefit />

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
        {/* 상품 문의 */}

        {/* 배송/반품/교환정보 */}
        <FoldedWrapper header={'배송/반품/교환정보'}>
          <ShippingReturn deals={deals} />
        </FoldedWrapper>
        {/* 상품고시정보 */}
        {SeparateLine}
        {/* 판매자의 연관상품 */}
        {/* 추천상품 */}
        {SeparateLine}
        {/* 셀러스토어 */}
      </DefaultLayout>
    );
  }
}

export default ProductDetail;

import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Gallery from 'components/productdetail/Gallery';
import ProductDetailName from 'components/productdetail/ProductDetailName';
import ProductDetailOption from 'components/productdetail/ProductDetailOption';
import CartAndPurchaseButton from 'components/productdetail/CartAndPurchaseButton';

class ProductDetail extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <DefaultLayout pageTitle={'상품-상세페이지'}>
        {/* 상세이미지갤러리 */}
        <Gallery />

        {/* 상세 상품 정보 */}
        <ProductDetailName />

        {/* 상세 상품 옵션 */}
        <ProductDetailOption />

        {/* 상품 상세 장바구니 , 구매하기 버튼 */}
        <CartAndPurchaseButton />
      </DefaultLayout>
    );
  }
}

export default ProductDetail;

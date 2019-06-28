import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import Gallery from 'components/productdetail/Gallery';
import DetailProductInfo from 'components/productdetail/DetailProductInfo';
import { observer, inject } from 'mobx-react';

@inject('login')
@observer
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
        <DetailProductInfo />
      </DefaultLayout>
    );
  }
}

export default ProductDetail;

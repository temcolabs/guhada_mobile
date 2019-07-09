import React from 'react';
import Head from 'next/head';
import ProductDetail from '../../template/product/ProductDetail';
import { inject, observer } from 'mobx-react';
import { getParameterByName } from '../../utils';
import Loading from '../../components/common/loading/Loading';
import { withRouter } from 'next/router';

@withRouter
@inject('productdetail', 'productDetailLike')
@observer
class index extends React.Component {
  componentDidMount() {
    let { productdetail, productDetailLike } = this.props;
    let dealsId = getParameterByName('deals');
    productdetail.getDeals(dealsId);
    productDetailLike.getUserLike();
    // window.addEventListener('scroll', this.props.productdetail.tabInfoFixed);
  }

  componentDidUpdate(prevProps) {
    let { productdetail } = this.props;
    if (
      prevProps.productdetail.deals.dealsId !== this.props.router.query.deals
    ) {
      let dealsId = getParameterByName('deals');
      productdetail.getDeals(dealsId);
    }
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.props.productdetail.tabInfoFixed);
  }
  render() {
    let { productdetail } = this.props;
    return (
      <>
        <Head>
          <title>상품-상세페이지</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>{productdetail.dealsStatus ? <ProductDetail /> : <Loading />}</div>
      </>
    );
  }
}

export default index;

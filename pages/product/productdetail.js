import React from 'react';
import ProductDetail from '../../template/product/ProductDetail';
import { inject, observer } from 'mobx-react';
import { getParameterByName } from '../../utils';
import Loading from '../../components/common/loading/Loading';
import { withRouter } from 'next/router';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@withScrollToTopOnMount
@withRouter
@inject('productdetail', 'productDetailLike', 'user')
@observer
class index extends React.Component {
  componentDidMount() {
    let { productdetail, productDetailLike, user } = this.props;
    let dealId = getParameterByName('deals');
    productdetail.getDeals(dealId);
    productDetailLike.getUserLike();

    // 상품 정보 가져오기
    productdetail.getDeals(dealId);

    // 크리테오 트래커
    criteoTracker.productDetail({
      email: user.userInfo?.email,
      dealId: dealId,
    });
  }

  componentDidUpdate(prevProps) {
    let { productdetail } = this.props;

    if (prevProps.router.query.deals !== this.props.router.query.deals) {
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
        <HeadForSEO pageName="상품-상세페이지" />

        <div>
          {productdetail.dealsStatus ? (
            <ProductDetail
              deals={productdetail.deals}
              claims={productdetail.claims}
              tags={productdetail.dealsTag}
              businessSeller={productdetail.businessSeller}
              seller={productdetail.seller}
              dealsOfSameBrand={productdetail.dealsOfSameBrand}
              dealsOfRecommend={productdetail.dealsOfRecommend}
              dealsOfSellerStore={productdetail.dealsOfSellerStore}
              followers={productdetail.followers}
              satisfaction={productdetail.satisfaction}
            />
          ) : (
            <Loading />
          )}
        </div>
      </>
    );
  }
}

export default index;

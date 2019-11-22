import React from 'react';
import ProductDetail from '../../template/product/ProductDetail';
import { inject, observer } from 'mobx-react';
import { getParameterByName } from '../../utils';
import Loading from '../../components/common/loading/Loading';
import Router, { withRouter } from 'next/router';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import API from 'childs/lib/API';
import _ from 'lodash';
import isServer from 'childs/lib/common/isServer';

@withScrollToTopOnMount
@withRouter
@inject('productdetail', 'productDetailLike', 'user')
@observer
class index extends React.Component {
  static async getInitialProps({ req }) {
    const dealsId = isServer ? req.query.deals : Router.query.deals;
    const { data } = await API.product.get(`/deals/${dealsId}`);
    const deals = data.data;

    const headData = {
      pageName: `${_.isNil(deals.season) === false ? deals.season : ''} ${
        deals.name
      }`,
      description: `${deals.brandName} - ${deals.name} - ${
        deals.discountPrice
      }원`,
      image: _.get(deals, 'imageUrls.0'),
    };

    return {
      initialState: {
        productdetail: {
          deals,
        },
      },
      headData,
    };
  }

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
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    // window.removeEventListener('scroll', this.props.productdetail.tabInfoFixed);
  }
  render() {
    let { productdetail, headData } = this.props;

    return (
      <>
        <HeadForSEO
          pageName={headData?.pageName}
          description={headData?.description}
          image={headData?.image}
        />

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

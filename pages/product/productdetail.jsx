import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';
import { useRouter } from 'next/router';
import API from 'childs/lib/API';
import isServer, { isBrowser } from 'childs/lib/common/isServer';
import sessionStorage from 'childs/lib/common/sessionStorage';
import mobonTracker from 'childs/lib/tracking/mobon/mobonTracker';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import { getHeadData } from 'stores/productdetail/ProductDetailStore';
import { getLayoutInfo } from 'stores/LayoutStore';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import ProductDetail from 'template/product/ProductDetail';
import MountLoading from 'components/atoms/Misc/MountLoading';

function ProductDetailPage() {
  /**
   * states
   */
  const {
    productdetail: productDetailStore,
    productDetailLike: productDetailLikeStore,
    user: userStore,
  } = useStores();
  const headData = productDetailStore.headData;
  const router = useRouter();
  const [tracked, setTracked] = useState(false);

  /**
   * side effects
   */
  useEffect(() => {
    if (productDetailStore.isInitial) {
      const { deals: dealId } = router.query;
      productDetailStore.getDeals(dealId);
    }

    if (
      !userStore.userInfo.id &&
      productDetailLikeStore.likeList.length === 0
    ) {
      productDetailLikeStore.getUserLike();
    }
  }, []);
  useEffect(() => {
    const { deals: dealId, pid } = router.query;

    if (productDetailStore.deals.dealId) {
      if (pid) {
        sessionStorage.set('pid', pid);
        sessionStorage.set('dealIdByPid', parseInt(dealId));
      }

      if (parseInt(dealId) !== parseInt(productDetailStore.deals.dealId)) {
        productDetailStore.getDeals(dealId);
      }

      if (
        !tracked &&
        parseInt(dealId) === parseInt(productDetailStore.deals.dealId)
      ) {
        criteoTracker.productDetail({
          email: userStore.userInfo?.email,
          dealId,
        });
        mobonTracker.productDetail(productDetailStore.deals);
        setTracked(true);
      }
    }
  }, [productDetailStore.deals]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO
        pageName={headData?.pageName}
        description={headData?.description}
        image={headData?.image}
        fullUrl={isBrowser && `${window.location.href}`}
      />
      {productDetailStore.isInitial || productDetailStore.isLoading ? (
        <MountLoading />
      ) : (
        <ProductDetail
          deals={productDetailStore.deals}
          claims={productDetailStore.claims}
          tags={productDetailStore.dealsTag}
          businessSeller={productDetailStore.businessSeller}
          seller={productDetailStore.seller}
          dealsOfSameBrand={productDetailStore.dealsOfSameBrand}
          dealsOfRecommend={productDetailStore.dealsOfRecommend}
          dealsOfSellerStore={productDetailStore.dealsOfSellerStore}
          followers={productDetailStore.followers}
          satisfaction={productDetailStore.satisfaction}
        />
      )}
    </>
  );
}

ProductDetailPage.getInitialProps = async function({ pathname, query }) {
  const initialProps = { layout: {} };

  if (isServer) {
    const initialState = {};

    const { type, headerFlags } = getLayoutInfo({ pathname, query });

    Object.assign(initialState, {
      layout: {
        type,
        headerFlags,
      },
    });

    const dealsId = query.deals;
    if (dealsId) {
      const { data } = await API.product.get(`/deals/${dealsId}`);
      const deals = data.data;
      const headData = getHeadData(deals);

      Object.assign(initialState, {
        productdetail: { deals, headData },
      });
    }

    Object.assign(initialProps, { initialState });
  }

  return initialProps;
};

export default observer(ProductDetailPage);

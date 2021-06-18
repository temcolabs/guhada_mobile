import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { get as _get } from 'lodash';
import moment from 'moment';
import useStores from 'stores/useStores';
import { getLayoutInfo } from 'stores/LayoutStore';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import { dateFormat } from 'childs/lib/constant';
import HeadForSEO from 'childs/lib/components/HeadForSEO';
import Layout from 'components/layout/Layout';
import SpecialDetail from 'template/event/SpecialDetail';
import MountLoading from 'components/atoms/Misc/MountLoading';

function SpecialDetailPage() {
  /**
   * states
   */
  const { newSpecial: newSpecialStore } = useStores();
  const headData = newSpecialStore.headData;
  const router = useRouter();

  /**
   * side effects
   */
  useEffect(() => {
    if (typeof window === 'object') {
      window.scrollTo(0, 0);
    }
    const eventId = router.query.id;
    newSpecialStore.fetchSpecialDetail(eventId);
  }, [newSpecialStore, router]);

  /**
   * render
   */
  return (
    <>
      <HeadForSEO
        pageName={headData.pageName || '기획전'}
        description={headData.description}
        image={headData.image}
      />
      <Layout title={'기획전'}>
        {newSpecialStore.isLoading && <MountLoading />}
        <SpecialDetail />
      </Layout>
    </>
  );
}

SpecialDetailPage.getInitialProps = async function({ req, pathname, query }) {
  if (isServer) {
    try {
      const eventId = query.id || req.query.id;
      if (!eventId) {
        throw new Error('Invalid request - eventId not found');
      }

      const { data } = await API.settle.get(
        `/plan/list/detail?eventId=${eventId}`
      );

      const specialDetail = data.data;

      const initialHeadData = {
        pageName: specialDetail.detailTitle,
        description: `구하다 기획전 "${specialDetail.detailTitle}". ${moment(
          specialDetail.startDate
        ).format(`${dateFormat.YYYYMMDD_UI} 부터`)} ${
          !!specialDetail.endDate
            ? moment(specialDetail.endDate).format(
                `${dateFormat.YYYYMMDD_UI} 까지`
              )
            : ''
        }`,
        image: _get(specialDetail, 'mediumImageUrl'),
      };

      const { type, headerFlags } = getLayoutInfo({
        pathname,
        query,
      });

      return {
        initialHeadData,
        initialState: {
          newSpecial: {
            eventId,
            specialDetail,
          },
          layout: {
            type,
            headerFlags,
          },
        },
      };
    } catch (error) {
      console.error(error.message);
      return {};
    }
  }
  return {};
};

SpecialDetailPage.propTypes = {
  initialHeadData: PropTypes.shape({
    pageName: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default observer(SpecialDetailPage);

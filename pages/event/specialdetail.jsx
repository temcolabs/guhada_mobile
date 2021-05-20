import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { get as _get } from 'lodash';
import moment from 'moment';

import useStores from 'stores/useStores';
import API from 'childs/lib/API';
import isServer from 'childs/lib/common/isServer';
import { dateFormat } from 'childs/lib/constant';

import HeadForSEO from 'childs/lib/components/HeadForSEO';
import SpecialDetail from 'template/event/SpecialDetail';

function SpecialDetailPage() {
  /**
   * states
   */
  const { newSpecial: newSpecialStore } = useStores();
  // const headData = initialHeadData || newSpecialStore.headData;
  const headData = newSpecialStore.headData;
  const router = useRouter();

  /**
   * side effects
   */
  useEffect(() => {
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
      <SpecialDetail />
    </>
  );
}

SpecialDetailPage.getInitialProps = async function({ req, query }) {
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

      return {
        initialHeadData,
        initialState: {
          newSpecial: {
            eventId,
            specialDetail,
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

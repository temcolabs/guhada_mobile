import React from 'react';
import PropTypes from 'prop-types';
import API from 'childs/lib/API';

import Image from 'components/atoms/Image';
import { Wrppaer } from './Styled';

// TODO : 백엔드에서 데이터 가져오는지 확인
const REVIEW_BANNER_URL = 'static/images/eventBanners/review_event_banner.png';

/**
 * 리뷰 > 상단 배너
 * @param {Array} banners
 * @returns
 */
function ReviewBanner({ banners }) {
  return (
    <Wrppaer>
      <Image src={REVIEW_BANNER_URL} />
    </Wrppaer>
  );
}

ReviewBanner.propTypes = {
  banners: PropTypes.array,
};

ReviewBanner.getInitialProps = async (ctx) => {
  const result = {
    banners: await getBanners(),
  };

  // 리뷰 배너 정보
  async function getBanners() {
    try {
      const { data } = await API.user('/event/banner?bannerType=REVIEW');
      const result = data.data;
      return result.length ? result.deals : null;
    } catch (e) {
      console.error(e.message);
    }
  }

  return result;
};

export default React.memo(ReviewBanner);

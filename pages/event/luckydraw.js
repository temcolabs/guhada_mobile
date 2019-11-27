import React, { Component, Fragment } from 'react';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import LuckyDraw from 'template/event/LuckyDraw';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@withScrollToTopOnMount
class LuckyDrawPage extends Component {
  static async getInitialProps({ req }) {
    return {};
  }

  render() {
    return (
      <Fragment>
        <HeadForSEO
          pageName="럭키드로우"
          image={`${
            process.env.API_CLOUD
          }/images/thumbnail/luckydraw/thumbnail_luckydraw.png`}
        />
        <LuckyDraw />
      </Fragment>
    );
  }
}
export default LuckyDrawPage;

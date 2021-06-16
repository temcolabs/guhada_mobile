import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import LuckyDrawTemplate from 'template/LuckyDraw';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@withScrollToTopOnMount
@inject('luckyDraw', 'main', 'login')
@observer
class LuckyDrawPage extends Component {
  render() {
    return (
      <Fragment>
        <HeadForSEO
          pageName="럭키드로우"
          image={`${
            process.env.API_CLOUD
          }/images/thumbnail/luckydraw/thumbnail_luckydraw.png`}
        />
        <LuckyDrawTemplate />
      </Fragment>
    );
  }
}
export default LuckyDrawPage;

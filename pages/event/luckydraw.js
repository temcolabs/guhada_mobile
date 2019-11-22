import React, { Component, Fragment } from 'react';
import Head from 'next/head';
import { inject, observer } from 'mobx-react';
// import { withRouter } from 'next/router';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import LuckyDraw from 'template/event/LuckyDraw';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@withScrollToTopOnMount
@observer
class LuckyDrawPage extends Component {
  componentDidMount() {
    console.log(`this.props.initialProps`, this.props.initialProps);
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

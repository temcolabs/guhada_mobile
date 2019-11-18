import React, { Component, Fragment } from 'react';
import Head from 'next/head';
import { inject, observer } from 'mobx-react';
// import { withRouter } from 'next/router';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import LuckyDraw from 'template/event/LuckyDraw';

@withScrollToTopOnMount
@observer
class LuckyDrawPage extends Component {
  componentDidMount() {}

  render() {
    return (
      <Fragment>
        <Head>
          <title>구하다 - 럭키드로우</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          <meta
            property="og:image"
            content={`${
              process.env.API_CLOUD
            }/images/thumbnail/luckydraw/thumbnail_luckydraw.png`}
          />
        </Head>
        <LuckyDraw />
      </Fragment>
    );
  }
}
export default LuckyDrawPage;

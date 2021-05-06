import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import withScrollToTopOnMount from 'components/common/hoc/withScrollToTopOnMount';
import LuckyDraw from 'template/event/_LuckyDraw';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@withScrollToTopOnMount
@inject('luckyDraw', 'main', 'login')
@observer
class LuckyDrawPage extends Component {
  componentDidMount() {
    this.props.luckyDraw.getLuckyDrawList();
    this.props.luckyDraw.initLuckyEventData();
  }

  render() {
    const { luckyDraw, main, login } = this.props;

    return (
      <Fragment>
        <HeadForSEO
          pageName="럭키드로우"
          image={`${
            process.env.API_CLOUD
          }/images/thumbnail/luckydraw/thumbnail_luckydraw.png`}
        />
        {luckyDraw?.luckyDrawData && (
          <LuckyDraw luckyDraw={luckyDraw} login={login} main={main} />
        )}
      </Fragment>
    );
  }
}
export default LuckyDrawPage;

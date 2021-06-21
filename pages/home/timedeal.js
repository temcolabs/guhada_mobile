import React, { Component } from 'react';
import TimeDeal from 'template/TimeDeal';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('timedeal')
@observer
class timedeal extends Component {
  componentDidMount() {
    const { timedeal } = this.props;
    timedeal.getTimeDeal();
  }
  render() {
    const { timedeal } = this.props;
    return (
      <>
        <HeadForSEO pageName="타임딜" />
        <div>{timedeal.timeDealStatus ? <TimeDeal /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default timedeal;

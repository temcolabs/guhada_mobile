import React, { Component } from 'react';
import Head from 'next/head';
import TimeDeal from 'template/home/TimeDeal';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('main')
@observer
class timedeal extends Component {
  render() {
    const { main } = this.props;
    return (
      <>
        <HeadForSEO pageName="타임딜" />
        <div>{main.timeDealStatus ? <TimeDeal /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default timedeal;

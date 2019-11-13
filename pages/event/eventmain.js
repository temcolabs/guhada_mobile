import React, { Component } from 'react';
import Head from 'next/head';
import EventMain from 'template/event/EventMain';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';

@inject('eventmain')
@observer
class eventmain extends Component {
  componentDidMount() {
    this.props.eventmain.getEventList();
  }
  render() {
    const { eventmain } = this.props;

    return (
      <>
        <Head>
          <title>구하다 - 이벤트</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <div>{eventmain.status.page ? <EventMain /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default eventmain;

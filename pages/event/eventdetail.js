import React, { Component } from 'react';
import Head from 'next/head';
import EventDetail from 'template/event/EventDetail';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';

@inject('eventmain')
@observer
class eventdetail extends Component {
  componentDidMount() {
    const url = document.location.href;
    const id = url.substr(url.lastIndexOf('/') + 1);
    this.props.eventmain.getEventDetail(id);
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
        <div>
          {eventmain.status.detailPage ? <EventDetail /> : <LoadingPortal />}
        </div>
      </>
    );
  }
}

export default eventdetail;

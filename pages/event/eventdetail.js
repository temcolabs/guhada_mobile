import React, { Component } from 'react';
import EventDetail from 'template/event/EventDetail';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

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
        <HeadForSEO pageName="이벤트" />
        <div>
          {eventmain.status.detailPage ? <EventDetail /> : <LoadingPortal />}
        </div>
      </>
    );
  }
}

export default eventdetail;

import React, { Component } from 'react';
import EventMain from 'template/event/EventMain';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('eventmain')
@observer
class eventmain extends Component {
  static async getInitialProps({ req }) {
    return {};
  }

  componentDidMount() {
    this.props.eventmain.getEventList();
  }

  render() {
    const { eventmain } = this.props;

    return (
      <>
        <HeadForSEO pageName="이벤트" />
        <div>{eventmain.status.page ? <EventMain /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default eventmain;

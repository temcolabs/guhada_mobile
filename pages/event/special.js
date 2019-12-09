import React, { Component } from 'react';
import SpecialList from 'template/event/SpecialList';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('eventmain')
@observer
class special extends Component {
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
        <HeadForSEO pageName="기획전" />
        <div>{eventmain.status.page ? <SpecialList /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default special;

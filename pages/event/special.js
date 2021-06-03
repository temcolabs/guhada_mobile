import React, { Component } from 'react';
import SpecialList from 'template/event/SpecialList';
import LoadingPortal from 'components/common/loading/Loading';
import { observer, inject } from 'mobx-react';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('special', 'newSpecial', 'searchByFilter')
@observer
class special extends Component {
  static async getInitialProps({ req }) {
    return {};
  }

  componentDidMount() {
    const { newSpecial: newSpecialStore } = this.props;
    newSpecialStore.resetSpecialData();

    this.props.special.getSpecialList();
  }

  render() {
    const { special } = this.props;

    return (
      <>
        <HeadForSEO pageName="기획전" />
        <div>{special.status.page ? <SpecialList /> : <LoadingPortal />}</div>
      </>
    );
  }
}

export default special;

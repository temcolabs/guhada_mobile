import React, { Component } from 'react';
import SellerStore from 'template/sellerstore/SellerStore';
import { isBrowser } from 'childs/lib/common/isServer';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('seller', 'login')
@observer
class SellerStorePage extends Component {
  componentDidMount() {
    const { seller } = this.props;
    const nickname = Router.router.query.nickname;
    if (isBrowser) {
      seller.nickname = nickname;
      seller.getSellerId();
      seller.toSearch({});
    }
  }
  componentDidUpdate() {
    const { seller } = this.props;
    const nickname = Router.router.query.nickname;
    if (isBrowser) {
      seller.nickname = nickname;
      seller.getSellerId();
    }
  }
  render() {
    const { seller, login } = this.props;
    return (
      <>
        <HeadForSEO pageName="셀러스토어" />

        <SellerStore seller={seller} login={login} />
      </>
    );
  }
}

export default SellerStorePage;

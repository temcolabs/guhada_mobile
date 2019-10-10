import React, { Component } from 'react';
import Head from 'next/head';
import withAuth from 'components/common/hoc/withAuth';
import SellerStore from 'template/sellerstore/SellerStore';
import { isBrowser } from 'lib/isServer';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';

@inject('seller', 'login')
@observer
class SellerStorePage extends Component {
  componentDidMount() {
    const { seller } = this.props;
    const nickname = Router.router.query.nickname;
    if (isBrowser) {
      seller.nickname = nickname;
      seller.getSellerId();
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
        <Head>
          <title>셀러스토어</title>
        </Head>
        <SellerStore seller={seller} login={login} />
      </>
    );
  }
}

export default SellerStorePage;

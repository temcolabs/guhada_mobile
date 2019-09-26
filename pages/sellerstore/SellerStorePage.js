import React, { Component } from 'react';
import Head from 'next/head';
import withAuth from 'components/common/hoc/withAuth';
import SellerStore from 'template/sellerstore/SellerStore';
import { isBrowser } from 'lib/isServer';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';
import { loginStatus } from 'constant';

@inject('seller', 'login')
@observer
class SellerStorePage extends Component {
  componentDidMount() {
    const { seller, login } = this.props;
    const sellerId = Router.router.query.sellerId;
    if (isBrowser) {
      seller.getSellerStore(sellerId);
      seller.getSellerStoreDeal(sellerId);

      if (login.loginStatus === loginStatus.LOGIN_DONE)
        seller.getFollowSellerStore(sellerId);
    }
  }
  componentDidUpdate() {
    const { seller, login } = this.props;
    const sellerId = Router.router.query.sellerId;
    if (isBrowser) {
      seller.getSellerStore(sellerId);
      seller.getSellerStoreDeal(sellerId);

      if (login.loginStatus === loginStatus.LOGIN_DONE)
        seller.getFollowSellerStore(sellerId);
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

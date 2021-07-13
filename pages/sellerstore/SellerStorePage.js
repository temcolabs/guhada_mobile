import { Component } from 'react';
import SellerStore from 'template/sellerstore/SellerStore';
import { isBrowser } from 'lib/common/isServer';
import { inject, observer } from 'mobx-react';
import Router from 'next/router';
import HeadForSEO from 'components/head/HeadForSEO';

@inject('seller', 'login', 'searchitem')
@observer
class SellerStorePage extends Component {
  componentDidMount() {
    const { seller } = this.props;
    const nickname = Router.router.query.nickname;
    const category = Router.router.query.category;

    if (category === undefined) {
      seller.toSearch({ nickname: nickname });
    }
    if (isBrowser) {
      seller.nickname = nickname;
      seller.getSellerId();
    }
  }
  componentDidUpdate() {
    const { seller } = this.props;
    const nickname = Router.router.query.nickname;
    const category = Router.router.query.category;

    if (category === undefined) {
      seller.toSearch({ nickname: nickname });
    }
    if (isBrowser) {
      seller.nickname = nickname;
      seller.getSellerId();
    }
  }

  componentWillUnmount() {
    const { seller } = this.props;
    seller.sellerId = '';
    seller.tabRefTop = '';
  }

  render() {
    const { seller, login, searchitem } = this.props;
    return (
      <>
        <HeadForSEO pageName="셀러스토어" />

        <SellerStore seller={seller} login={login} searchitem={searchitem} />
      </>
    );
  }
}

export default SellerStorePage;

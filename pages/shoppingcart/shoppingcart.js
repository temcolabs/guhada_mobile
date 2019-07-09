import React from 'react';
import Head from 'next/head';
import ShoppingCart from '../../template/shoppingcart/ShoppingCart';
import { inject, observer } from 'mobx-react';
import Loading from '../../components/common/loading/Loading';
@inject('shoppingcart')
@observer
class index extends React.Component {
  componentDidMount() {
    this.props.shoppingcart.getUserShoppingCartList();
  }
  render() {
    let { shoppingcart } = this.props;
    return (
      <>
        <Head>
          <title>장바구니</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          {shoppingcart.status.pageStatus ? <ShoppingCart /> : <Loading />}
        </div>
      </>
    );
  }
}

export default index;

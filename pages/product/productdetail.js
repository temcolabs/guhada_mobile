import React from 'react';
import { observer } from 'mobx-react';
import Head from 'next/head';
import ProductDetail from 'template/product/ProductDetail';

@observer
class index extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <>
        <Head>
          <title>상품-상세페이지</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/guhada.ico"
          />
        </Head>
        <div>
          <ProductDetail />
        </div>
      </>
    );
  }
}

export default index;

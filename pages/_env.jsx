import { Component } from 'react';

class env extends Component {
  render() {
    return (
      <>
        <div>
          <p>HOSTNAME: {process.env.HOSTNAME}</p>
          <p>HOSTNAME_MOBILE: {process.env.HOSTNAME_MOBILE}</p>
          <p>HOSTNAME_SELLER_ADMIN: {process.env.HOSTNAME_SELLER_ADMIN}</p>
          <p>API_PRODUCT_URL: {process.env.API_PRODUCT_URL}</p>
          <p>API_SEARCH: {process.env.API_SEARCH}</p>
          <p>API_USER: {process.env.API_USER}</p>
          <p>API_ORDER: {process.env.API_ORDER}</p>
          <p>API_CLAIM: {process.env.API_CLAIM}</p>
          <p>API_CLOUD: {process.env.API_CLOUD}</p>
          <p>API_BENEFIT: {process.env.API_BENEFIT}</p>
          <p>API_GATEWAY: {process.env.API_GATEWAY}</p>
          <p>API_BBS: {process.env.API_BBS}</p>
          <p>API_BBS_SEARCH: {process.env.API_BBS_SEARCH}</p>
          <p>API_NOTIFICATION: {process.env.API_NOTIFICATION}</p>
          <p>API_SHIP: {process.env.API_SHIP}</p>
          <p>API_SETTLE: {process.env.API_SETTLE}</p>
        </div>
      </>
    );
  }
}

export default env;

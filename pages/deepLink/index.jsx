import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

const APP_STORES = {
  android: 'https://play.google.com/store/apps/details?id=io.temco.guhada',
  ios: '',
};

function DeepLinkPage(props) {
  return <div />;
}

DeepLinkPage.propTypes = {};

export default withRouter(DeepLinkPage);

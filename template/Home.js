import React from 'react';
import PropTypes from 'prop-types';
import DefaultLayout from 'components/layout/DefaultLayout';

class Home extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <DefaultLayout title={null}>Home</DefaultLayout>;
  }
}

export default Home;

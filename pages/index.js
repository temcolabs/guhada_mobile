import React from 'react';
import Home from 'template/Home';
import { inject, observer } from 'mobx-react';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@inject('login', 'user')
@observer
class index extends React.Component {
  componentDidMount() {
    const { user: userStore } = this.props;
    criteoTracker.homepage({
      email: userStore.userInfo?.email,
    });
  }

  render() {
    return (
      <>
        <HeadForSEO />
        <div>
          <Home />
        </div>
      </>
    );
  }
}

export default index;

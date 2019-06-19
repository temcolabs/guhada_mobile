import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Alert from './Alert';

/**
 * mobx와 연동. 알림, 확인을 표시한다.
 */
@inject('alert')
@observer
class AlertConductor extends Component {
  render() {
    const { alert } = this.props;
    return (
      <Alert
        {...alert.props}
        isOpen={alert.isOpen}
        isConfirm={alert.props.isConfirm}
      />
    );
  }
}

export default AlertConductor;

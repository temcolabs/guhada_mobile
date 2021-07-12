import { Component } from 'react';
import css from './LoginWrapper.module.scss';
import ErrorToast from 'components/common/ErrorToast';

class LoginWrapper extends Component {
  render() {
    return (
      <div className={css.wrap}>
        <ErrorToast />
        {this.props.children}
      </div>
    );
  }
}

export default LoginWrapper;

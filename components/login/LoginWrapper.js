import React, { Component } from 'react';
import css from './LoginWrapper.module.scss';

export class LoginWrapper extends Component {
  render() {
    return <div className={css.wrap}>{this.props.children}</div>;
  }
}

export default LoginWrapper;

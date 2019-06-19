import React, { Component } from 'react';
import css from './DefaultLayout.module.scss';
import cn from 'classnames';

/**
 */
export default class DefaultLayout extends Component {
  render() {
    return <div className={css.wrap}>{this.props.children}</div>;
  }
}

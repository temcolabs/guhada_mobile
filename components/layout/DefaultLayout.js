import React, { Component } from 'react';
import css from './DefaultLayout.module.scss';
import Header from 'components/header/Header';

export default class DefaultLayout extends Component {
  render() {
    const { pageTitle } = this.props;
    return (
      <div className={css.wrap}>
        <Header>{pageTitle}</Header>
        {this.props.children}
      </div>
    );
  }
}
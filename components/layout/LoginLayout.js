import React, { Component } from 'react';
import css from './LoginLayout.module.scss';
import { LinkRoute } from 'childs/lib/router';

export class LoginLayout extends Component {
  render() {
    const { pageTitle, close, back } = this.props;

    return (
      <div className={css.wrap}>
        <div className={css.headerWrap}>
          {back !== false ? (
            <LinkRoute href={`/login`}>
              <div className={css.prevButton} />
            </LinkRoute>
          ) : (
            <div className={css.emptyButton} />
          )}

          {pageTitle}
          {close === true ? (
            <LinkRoute href={`/`}>
              <div className={css.closeButton} />
            </LinkRoute>
          ) : (
            <div className={css.emptyButton} />
          )}
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default LoginLayout;

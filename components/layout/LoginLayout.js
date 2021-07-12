import { Component } from 'react';
import PropTypes from 'prop-types';
import css from './LoginLayout.module.scss';
import { LinkRoute } from 'lib/router';

export class LoginLayout extends Component {
  static propTypes = {
    pageTitle: PropTypes.string,
    close: PropTypes.bool,
    back: PropTypes.bool,
  };

  render() {
    const { pageTitle, close, back } = this.props;

    return (
      <div className={css.wrap}>
        <div className={css.headerWrap}>
          {back ? (
            <LinkRoute href="/login">
              <div className="icon back" />
            </LinkRoute>
          ) : (
            <div className={css.emptyButton} />
          )}
          {pageTitle}
          {close ? (
            <LinkRoute href="/">
              <div className="icon close" />
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

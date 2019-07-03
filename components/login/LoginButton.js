import React, { Component } from 'react';
import css from './LoginButton.module.scss';
import cn from 'classnames';

/**
 * <LoginButton
    className={
    !(value.email && value.password) ? 'isGray' : 'isColored'
    }
    onClick={form.onSubmit}
    disabled={!(value.email && value.password)}
    >
        로그인
    </LoginButton>
 */

export class LoginButton extends Component {
  render() {
    const { field, children, className, style } = this.props;
    return (
      <div className={css.wrap}>
        <button
          className={cn(
            { [css.isGray]: className === 'isGray' },
            { [css.isColored]: className === 'isColored' }
          )}
          onClick={this.props.onClick}
          disabled={this.props.disabled}
          style={style}
        >
          {children}
        </button>
      </div>
    );
  }
}

export default LoginButton;

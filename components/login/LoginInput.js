import React, { Component } from 'react';
import css from './LoginInput.module.scss';
import cn from 'classnames';

export class LoginInput extends Component {
  render() {
    const { field, style, className } = this.props;
    return (
      <div className={cn(css.default)} style={style}>
        <input {...field.bind()} />
      </div>
    );
  }
}

export default LoginInput;

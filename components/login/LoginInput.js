import React, { Component } from 'react';
import css from './LoginInput.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react';

@observer
export class LoginInput extends Component {
  render() {
    const { field, style, className, countDown, maxLength, type } = this.props;
    return (
      <div className={cn(css.default)} style={style}>
        <input {...field.bind()} maxLength={maxLength} type={type} />
        {countDown ? <div className={css.countDown}>{countDown}</div> : null}
      </div>
    );
  }
}

export default LoginInput;

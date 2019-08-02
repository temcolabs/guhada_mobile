import React, { Component } from 'react';
import css from './LoginInput.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react';

@observer
class LoginInput extends Component {
  render() {
    const { field, style, countDown, maxLength } = this.props;
    return (
      <div className={cn(css.default)} style={style}>
        <input {...field.bind()} maxLength={maxLength} />
        {countDown ? <div className={css.countDown}>{countDown}</div> : null}
      </div>
    );
  }
}

export default LoginInput;

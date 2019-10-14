import React, { Component } from 'react';
import css from './LoginInput.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react';

@observer
class LoginInput extends Component {
  clearError = () => {
    const { field } = this.props;
    field.set('value', '');
    field.validate();
  };
  render() {
    const { field, style, countDown, maxLength } = this.props;
    return (
      <div className={cn(css.default)} style={style}>
        <input
          className={cn({ [css.errorBox]: field.error !== null })}
          {...field.bind()}
          maxLength={maxLength}
        />
        {field.error !== null && (
          <div className={css.errorBtn} onClick={() => this.clearError()} />
        )}
        {countDown ? <div className={css.countDown}>{countDown}</div> : null}
        {field.error !== null ? (
          <div className={css.error}>{field.error}</div>
        ) : null}
      </div>
    );
  }
}

export default LoginInput;

import React, { Component } from 'react';
import css from './LoginInput.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react';

@observer
class LoginInput extends Component {
  clearError = () => {
    const { field, check } = this.props;
    field.set('value', '');
    field.validate();
    check && check.set('value', '');
  };

  renderErrorComponents = (field, check) => {
    if (check && check.value && this.props.successMessage) {
      if (check.value === 'loading') {
        return <div className={css.loadingSpinner} />;
      }
      return <div className={css.success}>{check.value}</div>;
    } else if (field.error) {
      return (
        <>
          <div className={css.errorBtn} onClick={() => this.clearError()} />
          <div className={css.error}>{field.error}</div>
        </>
      );
    }
  };

  render() {
    const {
      field,
      check,
      style,
      countDown,
      maxLength,
      type,
      typeChangeHandle,
    } = this.props;

    return (
      <div className={cn(css.default)} style={style}>
        <input
          className={cn({ [css.errorBox]: field.error !== null })}
          {...field.bind({ type })}
          maxLength={maxLength}
          disabled={this.props.disabled}
        />
        {typeChangeHandle !== undefined ? (
          <div
            className={css.withIcon}
            style={
              type === 'password'
                ? {
                    backgroundImage: `url(/public/icon/login-pw-off@3x.png)`,
                    right: field.error ? '30px' : '10px',
                  }
                : {
                    backgroundImage: `url(/public/icon/login-pw-on@3x.png)`,
                    right: field.error ? '30px' : '10px',
                  }
            }
            onClick={() => {
              typeChangeHandle();
            }}
          />
        ) : null}
        {countDown ? <div className={css.countDown}>{countDown}</div> : null}
        {this.renderErrorComponents(field, check)}
      </div>
    );
  }
}

export default LoginInput;

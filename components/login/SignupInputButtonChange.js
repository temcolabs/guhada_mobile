import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import css from './SignupInputButtonChange.module.scss';
import cn from 'classnames';

@observer
class SignupInputButtonChange extends Component {
  render() {
    const { field, button, disabled } = this.props;
    return (
      <div className={css.wrap}>
        {this.props.countDown ? (
          <span className={css.countDown}>{this.props.countDown}</span>
        ) : null}
        <input
          className={cn(
            css.input,
            { [css.error]: field.error !== '' && field.error !== null },
            { [css.address]: this.props.address === true },
            { [css.success]: button.value === 'success' }
          )}
          {...field.bind()}
          disabled={disabled === true ? true : field.disabled}
          maxLength={this.props.maxLength}
        />
        <button
          className={cn(css.btn)}
          onClick={button.onSubmit}
          disabled={this.props.disabledButton}
        >
          {button.label}
        </button>
        {field.error != null ? (
          <div className={css.inputError}>{field.error}</div>
        ) : null}
      </div>
    );
  }
}

export default SignupInputButtonChange;

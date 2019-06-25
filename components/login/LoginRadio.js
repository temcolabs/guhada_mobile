import React, { Component } from 'react';
import css from './LoginRadio.module.scss';
import cn from 'classnames';

export class LoginRadio extends Component {
  render() {
    let { field, label, checked, value, onChangeRadio } = this.props;
    return (
      <div className={css.wrap}>
        <input
          type="radio"
          {...field.bind({
            value: value,
            checked: checked === value,
          })}
          id={`radio${value}`}
          onChange={() => onChangeRadio(value)}
        />
        <label htmlFor={`radio${value}`}>
          <span />
          <div>{label}</div>
        </label>
      </div>
    );
  }
}

export default LoginRadio;

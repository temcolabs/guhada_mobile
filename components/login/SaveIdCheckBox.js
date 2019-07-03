import React, { Component } from 'react';
import css from './LoginCheckBox.module.scss';
import cn from 'classnames';
export class SaveIdCheckBox extends Component {
  render() {
    const { id, onChange, checked, children } = this.props;
    return (
      <div className={cn(css.default)}>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} />
        <label htmlFor={id}>
          <span />
          <div>{children}</div>
        </label>
      </div>
    );
  }
}

export default SaveIdCheckBox;

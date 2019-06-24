import React, { Component } from 'react';
import css from './LoginCheckBox.module.scss';
import cn from 'classnames';
export class LoginCheckBox extends Component {
  render() {
    const { children, field, id, className, big } = this.props;
    return (
      <div
        className={cn(
          { [css.big]: big === true },
          { [css.default]: big !== true },
          { [css.wrap]: className === 'wrap' },
          { [css.termOption]: className === 'termOption' },
          { [css.emailsms]: className === 'emailsms' }
        )}
      >
        {field ? (
          <input
            type="checkbox"
            id={id ? id : field.name + 'test'}
            {...field.bind()}
          />
        ) : (
          <input type="checkbox" id={id ? id : field.name + 'test'} />
        )}

        <label htmlFor={id ? id : field.id}>
          <span />
          <div>{children ? children : field.label}</div>
          {className === 'termOption' ? (
            <div className={css.termText}>보기</div>
          ) : null}
        </label>
      </div>
    );
  }
}

export default LoginCheckBox;

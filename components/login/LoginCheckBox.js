import React, { Component } from 'react';
import css from './LoginCheckBox.module.scss';
import cn from 'classnames';
import { observer } from 'mobx-react';
import openPopupCenter from 'childs/lib/common/openPopupCenter';

@observer
class LoginCheckBox extends Component {
  openTermPopup = url => {
    const myWidth = document.documentElement.clientWidth;
    const myHeight = document.documentElement.clientHeight;

    openPopupCenter(url, 'term', myWidth, myHeight);
  };

  render() {
    const { children, field, id, className, big, href } = this.props;
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
        </label>
        {className === 'termOption' ? (
          <a className={css.termText} onClick={() => this.openTermPopup(href)}>
            보기
          </a>
        ) : null}
      </div>
    );
  }
}

export default LoginCheckBox;

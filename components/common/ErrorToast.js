import React, { Component } from 'react';
import css from './ErrorToast.module.scss';
import cn from 'classnames';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

/**
 * 사용하고자 하는 페이지에 <ErrorToast />를 선언
 * error가 적는 곳에 this.props.toast.getToast('에러메시지');
 */

@inject('toast')
@observer
class ErrorToast extends Component {
  render() {
    let { toast } = this.props;

    return (
      <div className={cn(css.wrap, { [css.show]: toast.status === true })}>
        {toast.error}
      </div>
    );
  }
}
export default ErrorToast;

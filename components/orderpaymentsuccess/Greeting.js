import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Greeting.module.scss';
@inject('orderpaymentsuccess', 'user')
@observer
class Greeting extends Component {
  render() {
    let { user } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.title}>
          <span>{user.userInfo.name || '고객'}</span>
          님의 주문이
          <div>정상적으로 완료 되었습니다.</div>
        </div>
      </div>
    );
  }
}

export default Greeting;

import { Component } from 'react';
import css from './FindLoginInfoHeader.module.scss';
import cn from 'classnames';
import { LinkRoute } from 'lib/router';

export class FindLoginInfoHeader extends Component {
  render() {
    let { select } = this.props;
    return (
      <div className={css.wrap}>
        <LinkRoute href="/login/findid">
          <a className={cn(css.item, { [css.select]: select === 'FindId' })}>
            아이디 찾기
          </a>
        </LinkRoute>
        <LinkRoute href="/login/findpassword">
          <a
            className={cn(css.itemRight, {
              [css.select]: select === 'FindPassword',
            })}
          >
            비밀번호 재설정
          </a>
        </LinkRoute>
      </div>
    );
  }
}

export default FindLoginInfoHeader;

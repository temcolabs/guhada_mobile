import { Component } from 'react';
import css from './ItemWrapper.module.scss';

/**
 * 헤더 값이 일정한 컴포넌트
 */
class ItemWrapper extends Component {
  render() {
    return (
      <div className={css.wrap}>
        <div className={css.header}>{this.props.header}</div>
        {this.props.children}
      </div>
    );
  }
}

export default ItemWrapper;

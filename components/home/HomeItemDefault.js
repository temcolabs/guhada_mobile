import React, { Component } from 'react';
import css from './HomeItemDefault.module.scss';
/**
 * @param {string} header 타이틀로 사용 될 텍스트
 */
export class HomeItemDefault extends Component {
  render() {
    return (
      <>
        <div className={css.wrap}>
          <div className={css.title}>{this.props.header}</div>
          <div>{this.props.children}</div>
        </div>
        <div className={css.marginArea} />
      </>
    );
  }
}

export default HomeItemDefault;

import React, { Component } from 'react';
import css from './InquiryItem.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

export class InquiryItem extends Component {
  static propTypes = {
    // createdAt: [2019, 7, 4, 7, 3, 56],
    id: PropTypes.number,
    inquirer: PropTypes.number,
    inquiry: PropTypes.object,
    nickname: PropTypes.string,
    private: PropTypes.bool,
    productId: PropTypes.number,
    // replier: null,
    // reply: null,
    // replyAt: null,
    replyUpdated: PropTypes.bool,
    status: PropTypes.string,
    // updatedAt: (6)[(2019, 7, 4, 7, 3, 56)],
  };

  state = {
    folded: true,
  };

  setFolded = () => {
    this.setState({ folded: !this.state.folded });
  };

  componentDidUpdate() {
    const { inquiry } = this.props;

    this.initComponent(inquiry);
  }

  initComponent = memoize(inquiry => {
    if (inquiry) this.setState({ folded: true });
  });

  render() {
    const { folded } = this.state;
    const { inquiry } = this.props;

    return (
      <>
        <div
          className={cn(css.wrap, { [css.open]: folded === false })}
          onClick={() =>
            inquiry.status === 'COMPLETED' ? this.setFolded() : null
          }
        >
          <div className={css.itemWrap}>
            <div
              className={cn(css.box, {
                [css.answer]: inquiry.status === 'COMPLETED',
              })}
            >
              {inquiry.status === 'COMPLETED' ? '답변완료' : '미답변'}
            </div>
            <div className={css.info}>
              <div className={css.nickname}>{inquiry.nickname}</div>
              <div className={css.line} />
              <div className={css.date}>19.03.19</div>
            </div>
          </div>
          <div
            className={cn(css.contentsWrap, { [css.open]: folded === false })}
          >
            <div className={cn(css.contents, { [css.open]: folded === false })}>
              {inquiry.inquiry}
              {folded === false ? (
                <span className={css.report}>신고</span>
              ) : null}
            </div>
            {inquiry.status === 'COMPLETED' ? (
              <div
                className={cn(css.arrow, { [css.up]: folded === false })}
                // onClick={() => this.setFolded()}
              />
            ) : null}
          </div>
          <div className={cn(css.answerWrap, { [css.open]: folded === false })}>
            <div className={css.answerIcon}>답변</div>
            <div className={css.answer}>
              {inquiry.reply}
              <div className={css.answerInfo}>
                판매자
                <span className={css.line} />
                <span className={css.date}>101010</span>
                <span className={css.report}>신고</span>
              </div>
            </div>
          </div>
        </div>
        <div className={cn(css.line, { [css.open]: folded === false })} />
      </>
    );
  }
}

export default InquiryItem;
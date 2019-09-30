import React, { Component } from 'react';
import css from './InquiryItem.module.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import moment from 'moment';
import { dateFormat } from 'constant/';
import _ from 'lodash';
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
          onClick={
            () => this.setFolded()
            // inquiry.status === 'COMPLETED' && inquiry.private !== true
            //   ? this.setFolded()
            //   : null
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
              <div className={css.date}>
                {moment(inquiry.createdAt).format(dateFormat.YYYYMMDD_UI)}
                {` `}
                {moment(inquiry.createdAt).format(dateFormat.HHMM)}
              </div>
            </div>
          </div>
          <div
            className={cn(css.contentsWrap, { [css.open]: folded === false })}
          >
            <div
              className={cn(css.contents, { [css.open]: folded === false })}
              style={{
                paddingBottom: _.isNil(inquiry.reply) !== false && '0px',
              }}
            >
              {inquiry.inquiry}
              {/* {folded === false ? (
                <span className={css.report}>신고</span>
              ) : null} */}
            </div>
            <div className={cn(css.arrow, { [css.up]: folded === false })} />
          </div>
          {inquiry.status === 'COMPLETED' && _.isNil(inquiry.reply) === false && (
            <div
              className={cn(css.answerWrap, { [css.open]: folded === false })}
            >
              <div className={css.answerIcon}>답변</div>
              <div className={css.answer}>
                {inquiry.reply}
                <div className={css.answerInfo}>
                  판매자
                  <span className={css.line} />
                  <span className={css.date}>
                    {moment(inquiry.replyAt).format(dateFormat.YYYYMMDD_UI)}
                    {` `}
                    {moment(inquiry.replyAt).format(dateFormat.HHMM)}
                  </span>
                  {/* <span className={css.report}>신고</span> */}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={cn(css.line, { [css.open]: folded === false })} />
      </>
    );
  }
}

export default InquiryItem;

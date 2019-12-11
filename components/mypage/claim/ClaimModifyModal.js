import React, { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

/**
 * 상품 문의 수정하기 모달
 */
@inject('mypageInquiry')
@observer
class ClaimModifyModal extends Component {
  state = {
    inquiry: {},
  };

  componentDidUpdate(prevProps, prevState) {
    let inquiry = this.props.inquiry;
    if (inquiry !== undefined)
      if (inquiry !== prevProps.inquiry) {
        this.setState({
          inquiry: inquiry,
        });
      }
  }

  setInquiryContents = value => {
    if (_.size(value) <= 1000) {
      this.setState(prevState => ({
        inquiry: {
          ...prevState.inquiry,
          inquiry: value,
        },
      }));
    } else {
      this.setState(prevState => ({
        inquiry: {
          ...prevState.inquiry,
          inquiry: value.substring(0, 1000),
        },
      }));
    }
  };

  setSecretInquiry = value => {
    this.setState(prevState => ({
      inquiry: {
        ...prevState.inquiry,
        private: value,
      },
    }));
  };

  render() {
    let { mypageInquiry } = this.props;

    return (
      <ModalWrapper
        isOpen={this.props.isOpen}
        onRequestClose={this.closeModal}
        contentLabel="product inquiry"
      >
        <div className="productInquiry__modal">
          <div className="productInquiry__modal-header">
            <div>상품 문의 수정하기</div>
            <img
              src="/static/icon/modal_close.png"
              width={29}
              height={29}
              onClick={() => this.props.closeModal()}
            />
          </div>
          <div>
            <textarea
              className="productInquiry__modal-textarea"
              placeholder="문의하실 내용을 입력하세요"
              onChange={e => this.setInquiryContents(e.target.value)}
              value={this.state.inquiry.inquiry}
            />
          </div>
          <div className="productInquiry__modal-checkBoxWrap">
            <div className="productInquiry__checkbox productInquiry__modal-checkbox">
              <input
                type="checkbox"
                id="askproduct"
                onChange={e => this.setSecretInquiry(e.target.checked)}
                checked={this.state.inquiry.private}
              />
              <label htmlFor="askproduct">
                <span />
                비공개글 설정
              </label>
            </div>
            <div className="productInquiry__modal-textCount">
              <span>{_.size(this.state.inquiry.inquiry)}</span>/1000
            </div>
          </div>
          <div className="productInquiry__modal-contents">
            문의하신 내용에 대한 답변은 해당 상품의 상세페이지 또는
            <span>{` `}마이페이지 > 상품문의</span>에서 확인하실 수 있습니다.
          </div>
          <div className="productInquiry__modal-btnwrap">
            <button onClick={() => this.props.closeModal()}>취소</button>
            <button
              onClick={() =>
                mypageInquiry.updateInquiry(
                  this.state.inquiry,
                  this.props.closeModal
                )
              }
            >
              수정
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }
}

export default ClaimModifyModal;

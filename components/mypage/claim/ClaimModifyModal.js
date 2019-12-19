import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import css from './ClaimModifyModal.module.scss';
import ModalLayout from 'components/layout/ModalLayout';
import Checkbox from '../form/Checkbox';
import SubmitButton, {
  SubmitButtonWrapper,
  CancelButton,
} from '../form/SubmitButton';

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
      <ModalLayout
        pageTitle={'상품 문의하기'}
        isOpen={this.props.isOpen}
        onClose={this.props.closeModal}
      >
        <div className={css.modal}>
          <div className={css.textAreaWrap}>
            <textarea
              className={css.textarea}
              placeholder="내용을 입력해주세요."
              onChange={e => this.setInquiryContents(e.target.value)}
              value={this.state.inquiry.inquiry}
            />
            <div className={css.textCount}>
              {_.size(this.state.inquiry.inquiry)}/1000
            </div>
          </div>

          <div className={css.guideWrap}>
            <div className={css.checkBoxWrap}>
              <Checkbox
                name="askproduct"
                onChange={this.setSecretInquiry}
                initialValue={this.state.inquiry.private}
              >
                비공개글 설정
              </Checkbox>
            </div>

            <div className={css.guide}>
              문의하신 내용에 대한 답변은 해당 상품의 상세페이지 또는{' '}
              <b>마이페이지 > 상품문의</b>에서 확인하실 수 있습니다.
            </div>
          </div>

          <SubmitButtonWrapper
            responsive
            fixedToBottom
            wrapperClassname={css.submitButtonWrapper}
          >
            <CancelButton onClick={this.props.closeModal}>취소</CancelButton>
            <SubmitButton
              type="button"
              onClick={() => {
                mypageInquiry.updateInquiry(
                  this.state.inquiry,
                  this.props.closeModal
                );
              }}
            >
              수정
            </SubmitButton>
          </SubmitButtonWrapper>
        </div>
      </ModalLayout>
    );
  }
}

export default ClaimModifyModal;

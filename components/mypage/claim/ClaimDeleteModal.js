import React, { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { observer, inject } from 'mobx-react';
import css from '../review/ReviewModal.module.scss';
import { devLog } from 'childs/lib/common/devLog';

@inject('mypageInquiry')
@observer
class ClaimDeleteModal extends Component {
  render() {
    let { mypageInquiry } = this.props;
    devLog('inquiry', this.props.inquiry);
    return (
      <ModalWrapper
        isOpen={this.props.isDeleteOpen}
        onClose={() => {}}
        contentStyle={{
          position: 'fixed',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
        }}
        contentLabel={'inquiryDelete'}
        zIndex={1000}
      >
        <div className={css.modalWrap}>
          <div
            className={css.close}
            onClick={() => this.props.handleDeleteModalClose()}
          >
            {' '}
          </div>
          <div className={css.text}>
            작성한 문의를 삭제할 경우
            <br /> 문의는 영구적으로 삭제되어 복구할 수 없습니다.
            <br /> 삭제하시겠습니까?
          </div>
          <div className={css.btnWrap}>
            <button onClick={() => this.props.handleDeleteModalClose()}>
              취소
            </button>
            <button
              className={css.isColored}
              onClick={() =>
                mypageInquiry.deleteInquiry(
                  this.props.inquiry,
                  this.props.handleDeleteModalClose
                )
              }
            >
              삭제
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }
}

export default ClaimDeleteModal;

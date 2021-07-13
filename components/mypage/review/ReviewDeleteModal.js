import { Component } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import { observer, inject } from 'mobx-react';
import css from './ReviewModal.module.scss';

@inject('mypagereview')
@observer
class ReviewDeleteModal extends Component {
  render() {
    let { mypagereview } = this.props;

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
        isBigModal={true}
        contentLabel={'reviewWrite'}
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
            작성한 리뷰를 삭제할 경우
            <br /> 리뷰는 영구적으로 삭제되어 복구할 수 없습니다.
            <br /> 삭제하시겠습니까?
          </div>
          <div className={css.btnWrap}>
            <button onClick={() => this.props.handleDeleteModalClose()}>
              취소
            </button>
            <button
              className={css.isColored}
              onClick={() =>
                mypagereview.reviewDelete(
                  this.props.reviewData,
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

export default ReviewDeleteModal;

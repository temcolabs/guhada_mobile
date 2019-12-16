import React, { Component } from 'react';
import _ from 'lodash';
import css from './ClaimListProduct.module.scss';
import ClaimItem from 'components/mypage/claim/ClaimItem';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';
import { inject, observer } from 'mobx-react';
import Pagination from 'components/common/Pagination';
import ClaimModifyModal from 'components/mypage/claim/ClaimModifyModal';
import ClaimAnswerSelect from 'components/mypage/claim/ClaimAnswerSelect';

@inject('mypageInquiry', 'alert')
@observer
class ClaimListProduct extends Component {
  state = {
    isOpen: false,
    deleteIsOpen: false,
    modalData: {},
  };

  handleModifyModal = modalItem => {
    this.setState({ isOpen: true, modalData: modalItem });
  };

  handleCloseModal = () => {
    this.setState({ isOpen: false });
  };

  componentDidMount() {
    const { mypageInquiry } = this.props;
    mypageInquiry.getInquirie();
  }

  handleChangePage = page => {
    const { mypageInquiry } = this.props;
    mypageInquiry.setPage(page);
    this.props.mypageInquiry.getInquirie(
      mypageInquiry.page,
      mypageInquiry.status
    );

    window.scroll(0, 0);
  };

  handleDeleteModalOpen = inquiry => {
    this.props.alert.showConfirm({
      content: () => (
        <div>
          작성한 문의를 삭제할 경우 문의는 영구적으로 삭제되어 복구할 수
          없습니다.
          <br />
          삭제하시겠습니까?
        </div>
      ),
      onConfirm: () => {
        this.props.mypageInquiry.deleteInquiry(inquiry);
      },
    });
  };

  render() {
    const { mypageInquiry } = this.props;
    const { inquiries = {} } = mypageInquiry;

    return (
      <div className={css.wrap}>
        <div className={css.periodWrap}>
          <div className={css.totalCountWrap}>
            {`총 ${inquiries.totalElements}개`}
          </div>
          <div className={css.answerWrap}>
            <ClaimAnswerSelect />
          </div>
        </div>

        {_.size(inquiries.content) > 0 ? (
          inquiries.content.map((contentItem, index) => {
            return (
              <ClaimItem
                product={contentItem.item}
                inquiry={contentItem.inquiry}
                handleModifyModal={this.handleModifyModal}
                handleDeleteModalOpen={() =>
                  this.handleDeleteModalOpen(contentItem.inquiry)
                }
              />
            );
          })
        ) : !mypageInquiry.isOnRequest ? (
          <MypageDataEmpty text="상품 문의 내역이 없습니다." />
        ) : null}

        <Pagination
          wrapperStyle={{ margin: '30px auto' }}
          initialPage={mypageInquiry.page}
          onChangePage={this.handleChangePage}
          itemsCountPerPage={5}
          totalItemsCount={inquiries.totalElements}
        />

        <ClaimModifyModal
          isOpen={this.state.isOpen}
          closeModal={this.handleCloseModal}
          inquiry={this.state.modalData}
        />
      </div>
    );
  }
}

export default ClaimListProduct;

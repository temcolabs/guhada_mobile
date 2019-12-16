import React, { Component } from 'react';
import _ from 'lodash';
import MyPageLayout from 'components/mypage/MyPageLayout';
import SectionHeading from 'components/common/SectionHeading';
import PeriodSelector from 'components/mypage/PeriodSelector';
import { dateUnit } from 'childs/lib/constant';
import css from './ClaimListProduct.module.scss';
import ClaimItem from 'components/mypage/claim/ClaimItem';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';
import { inject, observer } from 'mobx-react';
import Pagination from 'components/common/Pagination';
import ClaimModifyModal from 'components/mypage/claim/ClaimModifyModal';
import ClaimDeleteModal from 'components/mypage/claim/ClaimDeleteModal';
import ClaimAnswerSelect from 'components/mypage/claim/ClaimAnswerSelect';
import { scrollToTarget } from 'childs/lib/common/scroll';

@inject('mypageInquiry')
@observer
class ClaimListProduct extends Component {
  state = {
    isOpen: false,
    deleteIsOpen: false,
    modalData: {},
  };

  scrollTargetId = 'claimListTop';

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

    scrollToTarget(this.props.scrollTargetOnChangePage);
  };

  handleDeleteModalOpen = modalItem => {
    this.setState({ deleteIsOpen: true, modalData: modalItem });
  };

  handleDeleteModalClose = () => {
    this.setState({ deleteIsOpen: false });
  };

  /**
   * 날짜 선택
   */
  handleChangePeriod = ({
    startDate = '2019-07-01',
    endDate = '2019-12-31',
  }) => {};

  render() {
    const { mypageInquiry } = this.props;
    const { inquiries = {} } = mypageInquiry;

    return (
      <>
        <div className={css.periodWrap}>
          <div className={css.totalCountWrap}>
            {`총 ${inquiries.totalElements}개`}
          </div>
          <div className={css.answerWrap}>
            <ClaimAnswerSelect />
          </div>
          {/* <PeriodSelector
            defaultTabItems={[
              { value: 1, unit: dateUnit.WEEK },
              { value: 15, unit: dateUnit.DAY },
              { value: 30, unit: dateUnit.DAY },
              { value: 3, unit: dateUnit.MONTH },
              { value: 6, unit: dateUnit.MONTH },
              { value: 1, unit: dateUnit.YEAR },
              { value: 3, unit: dateUnit.YEAR },
            ]}
            isMonthlyTabVisible={false}
            onChangePeriod={this.handleChangePeriod}
          /> */}
        </div>

        {_.size(inquiries.content) > 0 ? (
          inquiries.content.map((inquirie, index) => {
            return (
              <ClaimItem
                content={inquirie}
                handleModifyModal={this.handleModifyModal}
                handleDeleteModalOpen={this.handleDeleteModalOpen}
              />
            );
          })
        ) : (
          <MypageDataEmpty text="상품 문의 내역이 없습니다." />
        )}

        <Pagination
          wrapperStyle={{ marginTop: '70px' }}
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

        <ClaimDeleteModal
          isDeleteOpen={this.state.deleteIsOpen}
          handleDeleteModalClose={this.handleDeleteModalClose}
          inquiry={this.state.modalData}
        />
      </>
    );
  }
}

export default ClaimListProduct;

import React, { Component } from 'react';
import _ from 'lodash';
import PeriodSelector from 'components/mypage/PeriodSelector';
import { dateUnit } from 'childs/lib/constant';
import css from './ClaimListProduct.module.scss';
import ClaimItemSeller from 'components/mypage/claim/ClaimItemSeller';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';
import { inject, observer } from 'mobx-react';
import Pagination from 'components/common/Pagination';
import ClaimModifyModal from 'components/mypage/claim/ClaimModifyModal';
import ClaimDeleteModal from 'components/mypage/claim/ClaimDeleteModal';
import ClaimAnswerSelect from 'components/mypage/claim/ClaimAnswerSelect';
import SellerClaimModal from 'components/claim/sellerclaim/SellerClaimModal';
import { scrollToTarget } from 'childs/lib/common/scroll';

/**
 * 판매자 문의 목록
 */
@inject('mypageInquiry', 'mypageSellerClaim', 'alert')
@observer
class ClaimListSeller extends Component {
  state = {
    isModifyModalOpen: false,
    modalData: {},
    page: 1,
    sellerClaimModal: {
      sellerId: null,
      orderProdGroupId: null,
      isOpen: false,
    },
  };

  pageSize = 5;

  scrollTargetId = 'claimListTop';

  componentDidMount() {
    this.props.mypageSellerClaim.getSellerClaimList({
      pageNo: this.state.page - 1,
      size: this.pageSize,
    });
  }

  handleOpenSellerClaimModal = (sellerClaim = {}) => {
    // TODO:
    this.setState({
      sellerClaimModal: {
        sellerId: null,
        orderProdGroupId: null,
        isOpen: true,
      },
    });
  };

  handleCloseSellerClaimModal = () => {
    this.setState({
      sellerId: null,
      orderProdGroupId: null,
      isOpen: false,
    });
  };

  handleChangePage = page => {
    this.setState({ page }, () => {
      this.props.mypageSellerClaim.getSellerClaimList({
        pageNo: this.state.page - 1,
        size: this.pageSize,
      });

      scrollToTarget(this.props.scrollTargetOnChangePage);
    });
  };

  handleDeleteModalOpen = (sellerClaim = {}) => {
    this.props.alert.showConfirm({
      content: '삭제하시겠습니까?',
      onConfirm: () => {
        // TODO: 문의 삭제 API 호출
      },
    });
  };

  /**
   * 날짜 선택
   */
  handleChangePeriod = ({
    startDate = '2019-07-01',
    endDate = '2019-12-31',
  }) => {};

  render() {
    const { mypageSellerClaim } = this.props;
    const { sellerClaimList } = mypageSellerClaim;
    const isListEmpty = sellerClaimList.content?.length === 0;

    return (
      <>
        <div className={css.listFilter} id={this.scrollTargetId}>
          {/* <div className={css.answerWrap}>
            <ClaimAnswerSelect />
          </div> */}
        </div>

        {!isListEmpty ? (
          mypageSellerClaim.sellerClaimList?.content?.map(
            (claimContent, index) => {
              return (
                <ClaimItemSeller
                  content={claimContent}
                  handleModifyModal={sellerClaim =>
                    this.handleOpenSellerClaimModal({
                      sellerId: sellerClaim?.sellerId,
                    })
                  }
                  handleDeleteModalOpen={this.handleDeleteModalOpen}
                />
              );
            }
          )
        ) : (
          <MypageDataEmpty text="상품 문의 내역이 없습니다." />
        )}

        <Pagination
          wrapperStyle={{ marginTop: '70px' }}
          initialPage={this.state.page}
          onChangePage={this.handleChangePage}
          itemsCountPerPage={this.pageSize}
          totalItemsCount={sellerClaimList.totalElements}
        />

        <SellerClaimModal
          isOpen={this.state.sellerClaimModal.isOpen}
          sellerId={this.state.sellerClaimModal.sellerId}
          onClose={this.handleCloseSellerClaimModal}
        />
      </>
    );
  }
}

export default ClaimListSeller;

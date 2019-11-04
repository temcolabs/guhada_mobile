import { observable, action } from 'mobx';
import { isBrowser } from 'lib/isServer';
import API from 'lib/API';
/**
 * 판매자 문의하기 관련
 */
export default class SellerClaimStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  // 셀러에게 주문한 상품들
  @observable myDealsOrdered = [];
  @observable isPossible = false;

  @action
  checkIsSellerClaimPossible = (sellerId, productInquiryOpen) => {
    API.order
      .get(`/order-review/seller-inquire-order`, {
        params: {
          sellerId,
        },
      })
      .then(res => {
        console.log(res, 'res');
        if (res.data.data.length > 0) {
          this.isPossible = true;
          this.myDealsOrdered = res.data.data;
        } else {
          this.root.alert.showConfirm({
            content:
              '해당 판매자에게 주문한 기록을 찾을 수 없습니다. 상품 문의를 통해서만 문의가 가능합니다.',
            cancelText: '취소',
            confirmText: '상품 문의하기',
            onConfirm: () => {
              productInquiryOpen();
            },
          });
        }
      })
      .catch(err => {
        console.log(err, '판매자문의하기 조회 err');
      });
  };

  @action
  closeClaim = () => {
    this.isPossible = false;
  };
}

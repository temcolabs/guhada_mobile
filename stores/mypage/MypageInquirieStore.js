import { observable, action, computed } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';

export default class MypageInquirieStore {
  @observable isOnRequest = false;
  @observable inquiries = {
    content: [],
    totalElements: 0,
  };

  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable page = 1;
  @observable status = '';

  @action
  setPage = page => {
    this.page = page;
  };

  @action
  setStatus = status => {
    this.status = status;
  };

  @action
  getInquirie = (page = 1, status = '') => {
    this.isOnRequest = true;
    API.claim
      .get(
        `/users/my-page/inquiries?page=${page -
          1}&size=5&sort=id,desc&status=${status}`
      )
      .then(res => {
        this.inquiries = res.data.data;
      })
      .finally(() => {
        this.isOnRequest = false;
      });
  };

  /**
   * 문의 등록
   */
  registerInquiry = ({ dealsId, productId, isPrivate, content, onSuccess }) => {
    API.claim
      .post(`/products/${productId}/inquiries`, {
        content,
        private: isPrivate,
      })
      .then(res => {
        this.root.alert.showAlert('등록되었습니다.');
        onSuccess();
      })
      .catch(e => {
        this.root.alert.showAlert('오류가 발생했습니다.');
      });
  };

  @action
  updateInquiry = (inquiry, close) => {
    API.claim
      .put(`/products/${inquiry.productId}/inquiries`, {
        content: inquiry.inquiry,
        inquiryId: inquiry.id,
        privateInquiry: inquiry.private,
      })
      .then(res => {
        close();
        this.getInquirie();
      });
  };

  @action
  deleteInquiry = (inquiry, onSuccess = () => {}) => {
    API.claim
      .delete(`/products/${inquiry.productId}/inquiries/${inquiry.id}`)
      .then(res => {
        onSuccess();
        this.getInquirie();
      });
  };
}

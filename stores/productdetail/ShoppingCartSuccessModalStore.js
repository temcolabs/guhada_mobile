import { observable, action, toJS } from 'mobx';
import Router from 'next/router';
/**
 * 확인, 알림 창 컨트롤을 위한 스토어
 */
const isServer = typeof window === 'undefined';
export default class ShoppingCartSuccessModalStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  DEFAULT_PROPS = {
    isConfirm: false, // 알림인지 확인인지
    onConfirm: this.hide, // 확인 버튼 눌렀을 때. 숨김 처리는 포함할 필요 없음.
    onCancel: this.hide, // 취소 버튼 눌렀을 때. 숨김 처리는 포함할 필요 없음.
    onRequestClose: this.hide,
    contentStyle: {},
    content: '',
    isButtonVisible: true,
    confirmText: '확인',
    cancelText: '취소',
    zIndex: 2000,
  };

  @observable
  isOpen = false; // 표시 여부

  @observable
  props = Object.assign({}, this.DEFAULT_PROPS);

  @action
  withHide = cb => {
    return () => {
      if (typeof cb === 'function') {
        cb();
      }
      this.hide();
    };
  };

  @action
  showModal = (props = {}) => {
    // TODO: 함수는 toJS에 의해 undefined가 됨. 확인 필요
    this.props = Object.assign({}, toJS(this.props), props, {
      onConfirm: this.withHide(props.onConfirm),
    });

    this.isOpen = true;
  };

  @action
  hide = () => {
    this.isOpen = false;
  };

  @action
  goProduct = id => {
    this.isOpen = false;
    Router.push(`/product/productdetail?deals=${id}`);
    // this.root.productdetail.getDeals(id);
  };
}

import { observable, action, toJS } from 'mobx';

/**
 * 확인, 알림 창 컨트롤을 위한 스토어
 */
export default class AlertStore {
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
    zIndex: 1000,
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
  showAlert = (data = {}) => {
    // data가 문자열이면 메시지만 전달한 것으로 판단함.
    const props = typeof data === 'string' ? { content: data } : data;

    // TODO: 함수는 toJS에 의해 undefined가 됨. 확인 필요
    this.props = Object.assign({}, toJS(this.props), props, {
      isConfirm: false,
      onConfirm: this.withHide(props.onConfirm),
    });

    this.isOpen = true;
  };

  @action
  showConfirm = (props = {}) => {
    this.props = Object.assign({}, toJS(this.props), props, {
      isConfirm: true,
      onConfirm: this.withHide(props.onConfirm),
      onCancel: this.withHide(props.conCancel),
    });

    this.isOpen = true;
  };

  @action
  hide = () => {
    this.isOpen = false;
  };
}

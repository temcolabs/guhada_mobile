/* eslint-disable no-undef */
import { observable, action, toJS } from 'mobx';
import { autoHypenPhone, getUserAgent } from '../../utils';
import API from 'childs/lib/API';
import Router from 'next/router';
import { HOSTNAME } from 'constant/hostname';
import { devLog } from 'childs/lib/common/devLog';
import { pushRoute } from 'childs/lib/router';
const isServer = typeof window === 'undefined';
export default class OrderPaymentStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable cartList;
  @observable orderInfo = {};
  @observable orderSidetabTotalInfo = {};
  @observable orderProductInfo;
  @observable orderUserInfo = {
    address: null,
    detailAddress: null,
    email: null,
    emailVerify: false,
    id: null,
    mobile: null,
    name: null,
    nickname: null,
    roadAddress: null,
    zip: null,
  };
  @observable usePoint = 0;
  @observable orderMyCouponWallet = [];
  @observable orderShippingList = {
    list: [],
    currentUseAddressId: 0,
    currentEditAddressId: 0,
    tempEditAddress: {},
    defaultAddress: {},
    newAddress: {
      shippingName: null,
      address: null,
      roadAddress: null,
      zip: null,
      detailAddress: null,
      recipientName: null,
      recipientMobile: null,
      defaultAddress: false,
      shippingMessage: false,
    },
    isAddShippingAddress: false,
  };
  @observable status = {
    pageStatus: false,
    selectedShipStatus: true,
    shppingRequestSelfStatus: false,
    newShppingRequestSelfStatus: false,
    shppingListModalStatus: false,
    totalDiscountDetailStatus: false,
    // orderPaymentAgreement: false,
    paymentProceed: false,
    newShippingName: false,
    newAddress: false,
    newDetail: false,
    newRecipientName: false,
    newRecipientMobile: false,
    orderProductOnOffStatus: true,
    addressSelf: false,
    cashReceipt: false,
    cashReceiptRequest: false,
  };

  @observable cashReceiptUsage = 'PERSONAL';
  @observable cashReceiptPhone = {
    first: '010',
    middle: null,
    last: null,
  };

  @observable registerNumber = {
    first: null,
    last: null,
  };

  @observable cashReceiptEntrepreneur = {
    first: null,
    middle: null,
    last: null,
  };

  entrepreneur;

  @observable orderTotalQuantity = 0;
  @observable shippingMessageOption = [];
  @observable option = [];
  @observable paymentMethod = 'Card';

  @observable paymentForm = {};

  @observable paymentMethodStyle = {
    background: '#5d2ed1',
    color: '#fff',
  };

  @observable applySelectedCoupon = [];

  //--------------------- 주문페이지 토탈 데이터 최초 바인딩 ---------------------
  @action
  getOrderItems = cartList => {
    this.cartList = cartList;
    API.order
      .get(`/order/orderForm?cartItemIdList=${this.cartList}`)
      .then(res => {
        let data = res.data.data;
        this.orderInfo = data;
        this.orderProductInfo = data.orderItemList;
        this.orderUserInfo = data.user;
        this.orderShippingList.defaultAddress = data.shippingAddress;
        this.shippingMessageOption = data.shippingMessage;
        this.orderMyCouponWallet = data.availableCouponWalletResponses;

        this.usePoint = 0;

        this.getPaymentInfo();
        this.emailCheck(data.user.email);
        this.getTotalQuantity();
        this.getShippingMessageOption();
        this.userVaildCheck();
        devLog(this.orderInfo, '주문 데이터');
        this.orderProductInfo.map(data => {
          if (data.orderValidStatus !== 'VALID') {
            this.root.alert.showAlert({
              content:
                '구매에 유효하지 않은 상품이 있습니다, 장바구니 로 돌아갑니다.',
              onConfirm: () => {
                pushRoute('/shoppingcart');
              },
            });
          }
        });

        if (!this.orderShippingList.defaultAddress) {
          this.status.selectedShipStatus = false;
        }

        // let paymentRemainCheck = JSON.parse(
        //   sessionStorage.getItem('paymentInfo')
        // );

        // if (paymentRemainCheck) {
        //   let resultMsg = getParameterByName('resultMsg');
        //   this.root.alert.showAlert({
        //     content: resultMsg || '결제가 취소되었습니다.',
        //   });
        //   window.scrollTo(0, paymentRemainCheck.wScroll);
        //   if (!paymentRemainCheck.shippingType) {
        //     this.status.selectedShipStatus = true;
        //     this.orderShippingList.newAddress =
        //       paymentRemainCheck.shippingAddress;

        //     this.orderShippingList.newAddress.shippingMessageType === 'SELF'
        //       ? (this.status.newShppingRequestSelfStatus = true)
        //       : (this.status.newShppingRequestSelfStatus = false);

        //     this.orderShippingList.isAddShippingAddress =
        //       paymentRemainCheck.addShippingAddress;

        //     this.orderShippingList.newAddress.defaultAddress =
        //       paymentRemainCheck.shippingAddress.defaultAddress;
        //   }

        //   this.paymentMethod = paymentRemainCheck.parentMethodCd;
        //   this.status.orderPaymentAgreement = !this.status
        //     .orderPaymentAgreement;

        //   sessionStorage.removeItem('paymentInfo');
        // }
        this.status.pageStatus = true;
        window.history.replaceState(
          {},
          null,
          `orderpayment?cartList=${this.cartList}`
        );
      })
      .catch(err => {
        devLog(err, 'err');
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || '오류발생'}`,
        //   onConfirm: () => {
        //     this.gotoMain();
        //   },
        // });
        Router.push('/');
      });
  };

  @action
  getPaymentInfo = () => {
    let cartItemPayments = [];
    for (let i = 0; i < this.orderProductInfo.length; i++) {
      cartItemPayments.push({
        cartItemId: this.orderProductInfo[i].cartItemId,
        couponNumber: '',
      });
    }
    API.order
      .post(`/order/calculate-payment-info?`, {
        cartItemPayments,
        consumptionPoint: this.usePoint,
      })
      .then(res => {
        let data = res;
        this.orderSidetabTotalInfo = data.data.data;
        devLog(toJS(this.orderSidetabTotalInfo), '결제정보창');
      })
      .catch(err => {
        devLog(err, 'err');
      });
  };
  gotoMain = () => {
    Router.push('/');
  };
  gotoLogin = () => {
    Router.push('/login');
  };
  //--------------------- 우편번호 검색 ---------------------
  @action
  searchZipcode = (path, addressEditing, setNewShippingAddress) => {
    daum.postcode.load(function() {
      new daum.Postcode({
        oncomplete: function(data) {
          switch (path) {
            case '주문페이지-신규':
              if (data.userSelectedType === 'J') {
                document.getElementById('new__zipCode').value = data.zonecode;
                document.getElementById('newAddress').value = data.jibunAddress;
                setNewShippingAddress(null, 'address', data);
              } else {
                document.getElementById('new__zipCode').value = data.zonecode;
                document.getElementById('newAddress').value = data.jibunAddress;
                setNewShippingAddress(null, 'roadAddress', data);
              }
              break;
            case '주문페이지-수정':
              if (data.userSelectedType === 'J') {
                document.getElementById('edit__zipCode').value = data.zonecode;
                addressEditing(null, 'address', data);
                document.getElementById('edit__address').value =
                  data.jibunAddress;
              } else {
                document.getElementById('edit__zipCode').value = data.zonecode;
                addressEditing(null, 'roadAddress', data);
                document.getElementById('edit__address').value =
                  data.roadAddress;
              }
              break;
            default:
              break;
          }
        },
      }).open();
    });
  };

  //--------------------- 신규주소 셋팅 ---------------------
  @action
  setNewShippingAddress = (e, target, address) => {
    switch (target) {
      case 'newShippingName':
        this.orderShippingList.newAddress.shippingName = e.target.value;
        break;
      case 'newDetailAddress':
        this.orderShippingList.newAddress.detailAddress = e.target.value;
        break;
      case 'newRecipientName':
        this.orderShippingList.newAddress.recipientName = e.target.value;
        break;
      case 'newRecipientMobile':
        let phoneNum = e.target.value;
        phoneNum = phoneNum.replace(/[^0-9]/g, '');

        this.orderShippingList.newAddress.recipientMobile = phoneNum;
        break;
      case 'roadAddress':
        this.orderShippingList.newAddress.roadAddress = address.roadAddress;
        this.orderShippingList.newAddress.zip = address.zonecode;
        this.orderShippingList.newAddress.address = address.address;
        break;
      case 'address':
        this.orderShippingList.newAddress.address = address.address;
        this.orderShippingList.newAddress.zip = address.zonecode;
        this.orderShippingList.newAddress.roadAddress = address.roadAddress;
        break;
      default:
        break;
    }
  };

  //--------------------- 신규주소 focusing check ---------------------
  @action
  newShippingAddressFocusingCheck = target => {
    this.status.newShippingName = false;
    this.status.newAddress = false;
    this.status.newDetail = false;
    this.status.newRecipientName = false;
    this.status.newRecipientMobile = false;
  };
  //--------------------- 주문배송 요청사항 변경 ---------------------
  @action
  changeShippingRequestOption = (shippingOption, target) => {
    if (target === '기본배송') {
      this.orderShippingList.defaultAddress.shippingMessage = shippingOption.value
        ? ''
        : shippingOption.label;

      shippingOption.value
        ? (this.status.shppingRequestSelfStatus = true)
        : (this.status.shppingRequestSelfStatus = false);
    } else {
      this.orderShippingList.newAddress.shippingMessage = shippingOption.value
        ? ''
        : shippingOption.label;

      shippingOption.value
        ? (this.status.newShppingRequestSelfStatus = true)
        : (this.status.newShppingRequestSelfStatus = false);
    }
    console.log(toJS(shippingOption), 'shippingOption');
  };

  @action
  selfShippingRequestOption = (e, target) => {
    if (target === '기본배송') {
      this.orderShippingList.defaultAddress.shippingMessage = e.target.value;
    } else {
      this.orderShippingList.newAddress.shippingMessage = e.target.value;
    }
  };

  @action
  newAddressCheckbox = (e, option) => {
    let bool = e.target.checked;
    if (option === 'default') {
      this.orderShippingList.newAddress.defaultAddress = bool;
      this.orderShippingList.isAddShippingAddress = bool;
    } else {
      if (this.orderShippingList.newAddress.defaultAddress) {
        this.orderShippingList.isAddShippingAddress = true;
      } else {
        this.orderShippingList.isAddShippingAddress = bool;
      }
    }
  };

  //--------------------- 배송지 옵션 변경 ---------------------
  @action
  setSelectedShipOption = () => {
    if (this.orderShippingList.defaultAddress) {
      this.status.selectedShipStatus = !this.status.selectedShipStatus;
    } else {
      this.root.alert.showAlert({
        content: '기본 배송지가 없습니다.',
      });
    }
  };

  //--------------------- 결제방법변경 ---------------------
  @action
  setPaymentMethod = targetMethod => {
    this.paymentMethod = targetMethod;
    this.methodChange();
  };
  //--------------------- 결제방법변경 모듈 ---------------------
  methodChange = () => {
    this.status.cashReceipt = false;
    this.status.cashReceiptRequest = false;

    switch (this.paymentMethod) {
      case 'Card':
        this.receiptDataInit();
        break;
      case 'DirectBank':
        this.status.cashReceipt = true;
        break;
      case 'VBank':
        this.status.cashReceipt = true;
        break;
      case 'TOKEN':
        this.receiptDataInit();
        break;
      default:
        break;
    }
  };
  //--------------------- 주문페이지에 가져올 장바구니 아이템 리스트 아이디 값 설정 ---------------------
  getCartList = () => {
    let tempArray = [];
    tempArray = this.cartList.split(',');
    return tempArray;
  };

  //--------------------- 배송지목록 모달창 오픈 , 배송지목록 데이터 설정 ---------------------
  @action
  shippingListModal = () => {
    API.user
      .get(`/users/${this.orderUserInfo.id}/shipping-addresses`)
      .then(res => {
        let data = res.data;
        this.orderShippingList.list = data.data;

        this.orderShippingList.list.map(data => {
          data.recipientMobile = autoHypenPhone(data.recipientMobile);
          if (data.defaultAddress) {
            this.orderShippingList.currentUseAddressId = data.id;
          }
        });
        this.status.shppingListModalStatus = true;
      })
      .catch(err => {
        devLog(err);
        this.status.shppingListModalStatus = true;
        this.status.addressSelf = true;
      });
  };
  //--------------------- 배송지목록 선택 변경(로컬) ---------------------
  @action
  shippingAddressChange = changeValue => {
    this.orderShippingList.currentUseAddressId = changeValue;
    devLog(
      this.orderShippingList.currentUseAddressId,
      'this.orderShippingList.currentUseAddressId'
    );
    this.addressEditCancel();
  };

  //--------------------- 배송지 적용(Local) ---------------------
  @action
  shippingAddressChangeConfirm = () => {
    if (this.orderShippingList.currentEditAddressId) {
      this.root.alert.showAlert({
        content: '수정중인 주소지를 저장해주세요.',
      });
    } else {
      this.orderShippingList.list.forEach(data => {
        if (data.id === this.orderShippingList.currentUseAddressId) {
          this.orderShippingList.defaultAddress.address = data.address;
          this.orderShippingList.defaultAddress.detailAddress =
            data.detailAddress;
          this.orderShippingList.defaultAddress.recipientMobile =
            data.recipientMobile;
          this.orderShippingList.defaultAddress.recipientName =
            data.recipientName;
          this.orderShippingList.defaultAddress.roadAddress = data.roadAddress;
          this.orderShippingList.defaultAddress.shippingName =
            data.shippingName;
          this.orderShippingList.defaultAddress.zip = data.zip;
        }
      });
      this.shippingListModalClose();
      this.status.selectedShipStatus = true;
      // devLog('바뀐 주소', toJS(this.orderShippingList.defaultAddress));
    }
  };

  @action
  addressListShow = () => {
    this.status.addressSelf = false;
  };

  @action
  addressSelfShow = () => {
    this.status.addressSelf = true;
  };

  //--------------------- 배송지 목록 수정 데이터 설정(Local) ---------------------
  @action
  addressEdit = id => {
    this.orderShippingList.currentUseAddressId = id;
    this.orderShippingList.currentEditAddressId = id;

    this.orderShippingList.list.map(data => {
      if (data.id == id) {
        this.orderShippingList.tempEditAddress = { ...data };
      }
    });
  };

  //--------------------- 배송지 목록 수정진행(Local) ---------------------
  @action
  addressEditing = (e, target, address) => {
    let editValue;
    if (e) {
      editValue = e.target.value;
    }
    switch (target) {
      case 'recipientName':
        this.orderShippingList.tempEditAddress.recipientName = editValue;
        break;
      case 'shippingName':
        this.orderShippingList.tempEditAddress.shippingName = editValue;
        break;
      case 'detailAddress':
        this.orderShippingList.tempEditAddress.detailAddress = editValue;
        break;
      case 'recipientMobile':
        this.orderShippingList.tempEditAddress.recipientMobile = editValue;
        break;
      case 'roadAddress':
        this.orderShippingList.tempEditAddress.roadAddress =
          address.roadAddress;
        this.orderShippingList.tempEditAddress.zip = address.zonecode;
        this.orderShippingList.tempEditAddress.address = address.address;
        break;
      case 'address':
        this.orderShippingList.tempEditAddress.address = address.address;
        this.orderShippingList.tempEditAddress.zip = address.zonecode;
        this.orderShippingList.tempEditAddress.roadAddress =
          address.roadAddress;
        break;
      default:
        break;
    }
  };

  //--------------------- 배송지 목록 수정 저장(DB) ---------------------
  @action
  addressEditSave = id => {
    this.orderShippingList.currentEditAddressId = 0;
    let targetId = id;
    let data = this.orderShippingList.tempEditAddress;

    API.user
      .put(
        `/users/${
          this.orderUserInfo.id
        }/shipping-addresses?shippingAddressId=${targetId}`,
        data
      )
      .then(res => {
        if (res.data.resultCode === 200) {
          this.orderShippingList.list.map((list, index) => {
            if (list.id === data.id) {
              this.orderShippingList.list[index] = data;
              if (this.orderShippingList.defaultAddress.id === data.id) {
                this.orderShippingList.defaultAddress = data;
              }
            }
          });
          this.root.alert.showAlert({
            content: '배송지 수정완료',
          });
        }
      });
  };

  //--------------------- 배송지 목록 수정 취소(Local) ---------------------
  @action
  addressEditCancel = () => {
    this.orderShippingList.currentEditAddressId = 0;
  };

  //--------------------- 배송지 목록 삭제(DB) ---------------------
  @action
  addressDeleteConfirm = id => {
    let targetId = id;

    this.root.alert.showConfirm({
      content: '배송지 를 삭제하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => {
        this.addressDelete(targetId);
      },
    });
  };

  addressDelete = targetId => {
    API.user
      .delete(
        `/users/${
          this.orderUserInfo.id
        }/shipping-addresses?shippingAddressId=${targetId}`
      )
      .then(res => {
        this.root.alert.showAlert({
          content: '배송지 삭제완료.',
        });
        this.orderShippingList.list.map((data, index) => {
          if (data.id === targetId) {
            this.orderShippingList.list.splice(index, 1);
          }
          if (this.orderShippingList.list.length > 0) {
            this.orderShippingList.currentUseAddressId = this.orderShippingList.list[0].id;
            this.orderShippingList.defaultAddress = this.orderShippingList.list[0];
          } else {
            this.status.shppingListModalStatus = !this.status
              .shppingListModalStatus;
            this.status.selectedShipStatus = false;
            this.orderShippingList.currentUseAddressId = 0;
            this.orderShippingList.defaultAddress = null;
          }
        });
      })
      .catch(err => {
        this.root.alert.showAlert({
          content: `${_.get(err, 'data.message') || 'error'}`,
        });
      });
  };

  @action
  shippingListModalClose = () => {
    this.status.shppingListModalStatus = false;
    this.addressEditCancel();
  };

  @action
  selfAddressConfirm = () => {
    if (!this.orderShippingList.newAddress.shippingName) {
      this.root.alert.showAlert({
        content: '배송지이름을 입력해주세요.',
      });
      this.status.newShippingName = true;
      return false;
    } else if (!this.orderShippingList.newAddress.address) {
      this.root.alert.showAlert({
        content: '주소를 입력해주세요.',
      });
      this.status.newAddress = true;
      return false;
    } else if (!this.orderShippingList.newAddress.detailAddress) {
      this.root.alert.showAlert({
        content: '상세주소를 입력해주세요.',
      });
      this.status.newDetail = true;
      return false;
    } else if (!this.orderShippingList.newAddress.recipientName) {
      this.root.alert.showAlert({
        content: '받는분 을 입력해주세요.',
      });
      this.status.newRecipientName = true;
      return false;
    } else if (!this.orderShippingList.newAddress.recipientMobile) {
      this.root.alert.showAlert({
        content: '연락처를 입력해주세요.',
      });
      this.status.newRecipientMobile = true;
      return false;
    } else if (this.orderShippingList.newAddress.recipientMobile) {
      let currentPhoneNum = this.orderShippingList.newAddress.recipientMobile;
      let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
      let regTel = /^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])-?\d{3,4}-?\d{4}$/;
      if (currentPhoneNum.length < 9 || currentPhoneNum.length > 11) {
        this.root.alert.showAlert({
          content: '배송지 연락처를 정확히 입력해주세요.',
        });
        this.status.newRecipientMobile = true;
        return false;
      } else if (
        !regPhone.test(currentPhoneNum) &&
        !regTel.test(currentPhoneNum)
      ) {
        this.root.alert.showAlert({
          content: '배송지 연락처를 정확히 입력해주세요.',
        });
        this.status.newRecipientMobile = true;
        return false;
      }
    }

    this.orderShippingList.defaultAddress = this.orderShippingList.newAddress;
    this.shippingListModalClose();
  };
  @action
  setCashReceiptHandler = value => {
    this.status.cashReceiptRequest = value;
  };

  @action
  setCashReceiptUsage = value => {
    this.cashReceiptUsage = value;
  };

  @action
  receiptPhone = (e, idx) => {
    if (idx === 'first') {
      this.cashReceiptPhone.first = e.value;
    } else if (idx === 'middle') {
      let value = e.target.value.replace(/[^0-9]/g, '');
      this.cashReceiptPhone.middle = value;
    } else if (idx === 'last') {
      let value = e.target.value.replace(/[^0-9]/g, '');
      this.cashReceiptPhone.last = value;
    }
  };
  @action
  receiptRegister = (e, idx) => {
    let value = e.target.value.replace(/[^0-9]/g, '');

    if (idx === 'first') {
      this.registerNumber.first = value;
    } else if (idx === 'last') {
      this.registerNumber.last = value;
    }
  };

  @action
  receiptEntrepreneur = (e, idx) => {
    let value = e.target.value.replace(/[^0-9]/g, '');

    if (idx === 'first') {
      this.cashReceiptEntrepreneur.first = value;
    } else if (idx === 'middle') {
      this.cashReceiptEntrepreneur.middle = value;
    } else if (idx === 'last') {
      this.cashReceiptEntrepreneur.last = value;
    }
  };
  receiptDataInit = () => {
    this.cashReceiptPhone = {
      first: '010',
      middle: null,
      last: null,
    };

    this.registerNumber = {
      first: null,
      last: null,
    };

    this.cashReceiptEntrepreneur = {
      first: null,
      middle: null,
      last: null,
    };
  };
  receiptDataInit = () => {
    this.cashReceiptPhone = {
      first: '010',
      middle: null,
      last: null,
    };

    this.registerNumber = {
      first: null,
      last: null,
    };

    this.cashReceiptEntrepreneur = {
      first: null,
      middle: null,
      last: null,
    };
  };
  //--------------------- 결제요청 ---------------------
  @action
  payment = () => {
    let cartList = this.getCartList();
    let paymentCheck = true;

    if (!this.orderUserInfo.name && !this.orderUserInfo.mobile) {
      this.root.alert.showAlert({
        content: '[필수] 본인인증을 해주세요.',
      });
      paymentCheck = false;
    } else if (!this.orderUserInfo.emailVerify) {
      this.root.alert.showAlert({
        content: '이메일을 인증해주세요.',
      });
      paymentCheck = false;
    } else if (!this.paymentMethod) {
      this.root.alert.showAlert({
        content: '결제수단을 선택해주세요.',
      });
      paymentCheck = false;
    } else if (this.paymentMethod === 'TOKEN') {
      this.root.alert.showAlert({
        content: '토큰결제 현재 사용 불가',
      });
      paymentCheck = false;
    }

    if (!this.status.selectedShipStatus) {
      if (!this.orderShippingList.newAddress.shippingName) {
        this.root.alert.showAlert({
          content: '배송지이름을 입력해주세요.',
        });
        this.status.newShippingName = true;
        paymentCheck = false;
      } else if (!this.orderShippingList.newAddress.address) {
        this.root.alert.showAlert({
          content: '주소를 입력해주세요.',
        });
        this.status.newAddress = true;
        paymentCheck = false;
      } else if (!this.orderShippingList.newAddress.detailAddress) {
        this.root.alert.showAlert({
          content: '상세주소를 입력해주세요.',
        });
        this.status.newDetail = true;
        paymentCheck = false;
      } else if (!this.orderShippingList.newAddress.recipientName) {
        this.root.alert.showAlert({
          content: '수령인을 입력해주세요.',
        });
        this.status.newRecipientName = true;
        paymentCheck = false;
      } else if (!this.orderShippingList.newAddress.recipientMobile) {
        this.root.alert.showAlert({
          content: '수령인의 연락처를 입력해주세요.',
        });
        this.status.newRecipientMobile = true;
        paymentCheck = false;
      } else if (this.orderShippingList.newAddress.recipientMobile) {
        let currentPhoneNum = this.orderShippingList.newAddress.recipientMobile;
        let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
        let regTel = /^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])-?\d{3,4}-?\d{4}$/;

        if (currentPhoneNum.length < 9 || currentPhoneNum.length > 11) {
          this.root.alert.showAlert({
            content: '연락처를 정확히 입력해주세요.',
          });
          this.status.newRecipientMobile = true;
          paymentCheck = false;
        } else if (
          !regPhone.test(currentPhoneNum) &&
          !regTel.test(currentPhoneNum)
        ) {
          this.root.alert.showAlert({
            content: '연락처를 정확히 입력해주세요.',
          });
          this.status.newRecipientMobile = true;
          paymentCheck = false;
        }
      }
      // if (
      //   this.orderShippingList.newAddress.shippingMessage ===
      //   '배송 메세지를 입력해주세요.'
      // ) {
      //   this.root.alert.showAlert({
      //     content: '배송요청사항을 입력해주세요.',
      //   });
      //   paymentCheck = false;
      // } else if (!this.orderShippingList.newAddress.shippingMessage) {
      //   this.root.alert.showAlert({
      //     content: '배송요청사항을 선택해주세요.',
      //   });
      //   paymentCheck = false;
      // }
    }

    if (this.status.selectedShipStatus) {
      if (!this.orderShippingList.defaultAddress.recipientMobile) {
        this.root.alert.showAlert({
          content: '배송지 연락처를 입력해주세요.',
        });
        paymentCheck = false;
      }
    }

    if (this.status.cashReceiptRequest) {
      if (this.cashReceiptUsage === 'PERSONAL') {
        for (let n in this.cashReceiptPhone) {
          if (!this.cashReceiptPhone[n]) {
            this.root.alert.showAlert({
              content: '현금영수증 정보를 정확히 입력해주세요',
            });
            paymentCheck = false;
          }
        }
      } else {
        for (let n in this.cashReceiptEntrepreneur) {
          if (!this.cashReceiptEntrepreneur[n]) {
            this.root.alert.showAlert({
              content: '현금영수증 정보를 정확히 입력해주세요',
            });
            paymentCheck = false;
          }
        }
      }
    }

    if (!paymentCheck) {
      return false;
    }
    let cartItemPayments = [];
    if (this.applySelectedCoupon.length === 0) {
      cartItemPayments = cartList.map(data => {
        return {
          cartItemId: Number(data),
          couponNumber: '',
        };
      });
    } else {
      for (let i = 0; i < this.applySelectedCoupon.length; i++) {
        if (this.applySelectedCoupon[i].couponNumber) {
          cartItemPayments.push({
            cartItemId: Number(this.applySelectedCoupon[i].cartItemId),
            couponNumber: this.applySelectedCoupon[i].couponNumber,
          });
        } else {
          cartItemPayments.push({
            cartItemId: Number(
              this.root.orderPaymentBenefit.selectedCouponList[i].cartItemId
            ),
            couponNumber: '',
          });
        }
      }
    }

    let forms;
    if (this.status.cashReceiptRequest) {
      forms = {
        cartItemPayments: cartItemPayments,
        couponPayments: {},
        parentMethodCd: this.paymentMethod,
        pointPayments: {},
        shippingAddress: this.status.selectedShipStatus
          ? this.orderShippingList.defaultAddress
          : this.orderShippingList.newAddress,
        user: this.orderUserInfo,
        userAgent: getUserAgent(),
        addShippingAddress: this.orderShippingList.isAddShippingAddress,
        shippingType: this.status.selectedShipStatus,
        wScroll: window.scrollY,
        consumptionPoint: this.usePoint,
        cashReceiptUsage: this.cashReceiptUsage,

        cashReceiptNo:
          this.cashReceiptUsage === 'PERSONAL'
            ? String(this.cashReceiptPhone.first) +
              String(this.cashReceiptPhone.middle) +
              String(this.cashReceiptPhone.last)
            : String(this.cashReceiptEntrepreneur.first) +
              String(this.cashReceiptEntrepreneur.middle) +
              String(this.cashReceiptEntrepreneur.last),
        cashReceiptType:
          this.cashReceiptUsage === 'PERSONAL' ? 'MOBILE' : 'BUSINESS',
        web: true,
      };
    } else {
      forms = {
        cartItemPayments: cartItemPayments,
        couponPayments: {},
        parentMethodCd: this.paymentMethod,
        pointPayments: {},
        shippingAddress: this.status.selectedShipStatus
          ? this.orderShippingList.defaultAddress
          : this.orderShippingList.newAddress,
        user: this.orderUserInfo,
        userAgent: getUserAgent(),
        addShippingAddress: this.orderShippingList.isAddShippingAddress,
        shippingType: this.status.selectedShipStatus,
        wScroll: window.scrollY,
        consumptionPoint: this.usePoint,

        web: true,
      };
    }
    devLog(forms, 'forms');

    // const query = qs.stringify({
    //   cartList: cartList,
    // });

    API.order
      .post(`/order/requestOrder`, forms)
      .then(res => {
        this.status.paymentProceed = true;
        let data = res.data.data;
        let returnUrl = `${HOSTNAME}/privyCertifyResult`;
        let nextUrl = `${HOSTNAME}/privyCertifyResult?${data.pgOid}`;

        devLog(nextUrl, 'nextUrl');

        devLog(data, 'requestOrder return data');

        this.paymentForm = {
          version: data.version,
          mid: data.pgMid,
          goodname: data.prodNm,
          price: data.pgAmount,
          buyername: data.purchaseNm,
          buyertel: data.purchasePhone,
          buyeremail: data.purchaseEmail,
          gopaymethod: data.parentMethodCd,
          ini_cardcode: data.methodCd,
          oid: data.pgOid,
          timestamp: data.timestamp,
          currency: data.currency,
          signature: data.signature,
          mKey: data.key,
          offerPeriod: data.offerPeriod,
          acceptmethod: data.acceptMethod,
          languageView: data.languageView,
          charset: data.charset,
          payViewType: data.payViewType,
          closeUrl: data.closeUrl,
          popupUrl: data.popupUrl,
          ini_onlycardcode: data.methodCd,
          vbankTypeUse: '1',
          quotabase: data.cardQuota,
          returnUrl: returnUrl,
          jsUrl: data.jsUrl,
          nextUrl: nextUrl,
          vbankdt: data.expireDate,
        };
        sessionStorage.setItem('paymentInfo', JSON.stringify(forms));
      })
      .catch(err => {
        devLog(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || '결제 오류'}`,
        // });
        this.status.paymentProceed = false;
      });
  };

  @action
  paymentStart = () => {
    // const action = () => {
    let form = document.getElementById('paymentForm');

    // euc-kr 로 form 전달해야함.
    // form.P_GOODS.value = encodeURIComponent(form.P_GOODS.value);
    // form.P_UNAME.value = encodeURIComponent(form.P_UNAME.value);

    // devLog(form, 'form check');
    // devLog(this.paymentForm.jsUrl, 'check this.paymentForm.jsUrl');
    // devLog(form.P_GOODS.value, form.P_UNAME.value, 'check encode');
    form.action = this.paymentForm.jsUrl;
    form.submit();
    // };
    // const url = this.paymentForm.jsUrl;
    // loadScript(url, { callback: action, async: false, id: 'INIStdPay' });
  };

  @action
  totalDiscountDetailActive = () => {
    this.status.totalDiscountDetailStatus = !this.status
      .totalDiscountDetailStatus;
  };
  // @action
  // orderPaymentAgreement = () => {
  //   this.status.orderPaymentAgreement = !this.status.orderPaymentAgreement;
  // };

  @action
  orderpaymentInit = () => {
    this.orderShippingList = {
      list: [],
      currentUseAddressId: 0,
      currentEditAddressId: 0,
      tempEditAddress: {},
      defaultAddress: {},
      newAddress: {
        shippingName: null,
        address: null,
        roadAddress: null,
        zip: null,
        detailAddress: null,
        recipientName: null,
        recipientMobile: null,
        shippingMessageType: null,
        defaultAddress: false,
      },
      isAddShippingAddress: false,
    };
    this.orderUserInfo = {
      address: null,
      detailAddress: null,
      email: null,
      emailVerify: false,
      id: null,
      mobile: null,
      name: null,
      nickname: null,
      roadAddress: null,
      zip: null,
    };
    this.status = {
      pageStatus: false,
      selectedShipStatus: true,
      shppingRequestSelfStatus: false,
      newShppingRequestSelfStatus: false,
      shppingListModalStatus: false,
      // orderPaymentAgreement: false,
      paymentProceed: false,
      newShippingName: false,
      newAddress: false,
      newDetail: false,
      newRecipientName: false,
      newRecipientMobile: false,
      cashReceipt: false,
      cashReceiptRequest: false,
    };
    this.paymentMethod = 'Card';

    this.orderInfo = {};
    this.shippingListModalClose();
    this.root.orderPaymentBenefit.handleModalClose();
    this.applySelectedCoupon = [];
    this.root.orderPaymentBenefit.applyCoupon = {
      applyDiscount: 0,
      applyCouponAmount: 0,
    };
    this.root.customerauthentication.sendMailSuccess = false;
    this.root.orderPaymentBenefit.myCoupon = 0;
  };

  getTotalQuantity = () => {
    this.orderTotalQuantity = 0;
    for (let i = 0; i < this.orderProductInfo.length; i++) {
      this.orderTotalQuantity += this.orderProductInfo[i].quantity;
    }
  };

  @action
  orderProductOnOff = () => {
    this.status.orderProductOnOffStatus = !this.status.orderProductOnOffStatus;
  };

  @action
  getShippingMessageOption = () => {
    this.shippingMessageOption = this.shippingMessageOption
      .map(data => {
        return {
          value: data.message === '배송 메시지를 입력해주세요.' ? true : false,
          label: data.message,
        };
      })
      .filter(opt => opt.value !== 'NONE');
  };

  /*
    베네핏 스토어와 연결됨
  */
  @action
  totalPaymentAmount = () => {
    this.orderInfo.totalDiscountDiffPrice =
      this.orderInfo.originDiscountDiffPrice +
      this.usePoint +
      this.orderInfo.couponDiscount;

    this.orderInfo.totalPaymentPrice =
      this.orderInfo.originPaymentPrice -
      this.usePoint -
      this.orderInfo.couponDiscount;

    if (this.orderInfo.totalPaymentPrice < 0) {
      this.orderInfo.totalPaymentPrice = 0;
      this.usePoint = 0;
    }
    devLog(
      this.orderInfo.totalPaymentPrice,
      'this.orderInfo.totalPaymentPrice'
    );
  };

  @action
  emailCheck = email => {
    let emailValid = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (emailValid.test(email) === false) {
      this.root.customerauthentication.emailValid = false;
    } else {
      this.root.customerauthentication.emailValid = true;
      this.root.customerauthentication.email = email;
    }
  };

  @action
  userVaildCheck = () => {
    API.user
      .get(`/users/${this.orderUserInfo.id}`)
      .then(res => {
        this.root.customerauthentication.userVerify =
          res.data.data.userDetail.diCode;
      })
      .catch(err => {
        console.log(err);
      });
  };
}

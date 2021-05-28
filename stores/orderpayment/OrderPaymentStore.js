/* eslint-disable no-undef */
import { observable, action, toJS } from 'mobx';
import { autoHypenPhone, getUserAgent } from '../../utils';
import API from 'childs/lib/API';
import qs from 'qs';
import moment from 'moment';
import { getParameterByName } from 'utils';
import { HOSTNAME } from 'childs/lib/constant/hostname';
import { devLog } from 'childs/lib/common/devLog';
import { pushRoute } from 'childs/lib/router';
import isEmailString from 'childs/lib/string/isEmailString';
import accountService from 'childs/lib/API/order/accountService';
import sessionStorageImpl from 'childs/lib/common/sessionStorage';
import loadScript from 'childs/lib/dom/loadScript';
import isDev from 'childs/lib/common/isDev';
import isServer from 'childs/lib/common/isServer';

export default class OrderPaymentStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable cartList; // 주문페이지 에 사용하는 주문 상품 정보 : type string
  @observable orderInfo = {}; //주문 전체 정보
  @observable orderSidetabTotalInfo = {}; //사이드 주문결제 정보
  @observable orderProductInfo; //주문 상품 정보
  @observable orderCouponInfo = null; //주문 쿠폰 정보
  /*
    주문 유저 및 배송지정보
  */
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
    refundBankCode: null,
    refundBankName: null,
    refundBankAccountNumber: null,
    refundBankAccountOwner: null,
  };
  @observable usePoint = 0;

  /*
    주문 유저 및 배송지정보
    배송지 데이터 변경을 관리하기위한 데이터
  */
  @observable orderMyCouponWallet = [];
  @observable orderShippingList = {
    list: [],
    currentUseAddressId: 0, //실제사용할 배송지 넘버
    currentEditAddressId: 0, // 수정에 필요한 배송지 넘버
    tempEditAddress: {}, // 수정을 위한 임시
    defaultAddress: {}, // 최초 기본 주소
    newAddress: {
      shippingName: '',
      address: '',
      roadAddress: '',
      zip: '',
      detailAddress: '',
      recipientName: '',
      recipientMobile: '',
      defaultAddress: false,
      shippingMessage: false,
    },
    isAddShippingAddress: false, // 결제 완료후 배송지 정보 처리
    otherRequest: null, // 다른 문의 사항
  };

  // 해외 통관 부호 값
  @observable customIdNumber = '';

  // 해외 통관 부호 필수 체크 값
  @observable customIdNumberAgreed = false;

  @observable addressType = 'R';
  /**
   * 주문서에서 사용하게 될 상태 값들
   */
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
    couponSelectModal: false,
    loadingStatus: false,
    VBank: false,
    refundBankAccount: false,
    EasyPayment: false,
  };

  @observable cashReceiptUsage = 'PERSONAL';

  /**
   * 현금 영수증 정보
   */
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

  @observable selectedCouponList = [];
  @observable tempSelectedCouponList = [];
  @observable totalCouponDiscount = 0;
  @observable totalCouponUsedCount = 0;
  @observable totalDiscountPrice = 0;

  @observable easyPaymentList = [];

  @observable easyPaymentMap = {
    NAVER: {
      label: '네이버페이',
      iconUrl: '/static/icon/payment/order_payment_naverpay.png',
      width: '78px',
    },
    KAKAO: {
      label: '카카오페이',
      iconUrl: '/static/icon/payment/order_payment_kakaopay.png',
      width: '57px',
    },
    PAYCO: {
      label: '페이코페이',
      iconUrl: '/static/icon/payment/payco_icon.png',
      width: '60px',
    },
    SAMSUNG: {
      label: '삼성페이',
      iconUrl: '/static/icon/payment/samsungpay_icon_01.png',
      width: '117px',
    },
    LPAY: {
      label: 'L.페이',
      iconUrl: '/static/icon/payment/lpay_icon.png',
      width: '51px',
    },
    SSGPAY: {
      label: 'SSG페이',
      iconUrl: '/static/icon/payment/ssgpay_icon.png',
      width: '67px',
    },
    TOSS: {
      label: '토스',
      iconUrl: '/static/icon/payment/toss_icon.png',
      width: '59px',
    },
  };

  //--------------------- 주문페이지 토탈 데이터 최초 바인딩 ---------------------
  @action
  getOrderItems = (cartList) => {
    this.cartList = cartList;
    API.order
      .get(`/order/orderForm?cartItemIdList=${this.cartList}`)
      .then((res) => {
        let data = res.data.data;
        this.orderInfo = data;
        this.orderProductInfo = data.orderItemList;
        this.orderUserInfo = data.user;
        this.orderShippingList.defaultAddress = data.shippingAddress;
        this.shippingMessageOption = data.shippingMessage;
        this.orderMyCouponWallet = data.availableCouponWalletResponses;

        this.usePoint = 0;

        this.userAuthenticationCheck(); // 유저 인증 정보 체크 (본인인증 여부만 , 이메일 인증여부는 체크에서 빠짐)
        this.emailValidCheck(data.user.email);
        this.getTotalQuantity();
        this.getShippingMessageOption();

        this.getCouponInfo(this.cartList);

        devLog(this.orderInfo, '주문 데이터');

        this.easyPaymentList = [];

        this.orderInfo.paymentsMethod.forEach((paymentMethod) => {
          if (paymentMethod.methodCode === 'EASY') {
            paymentMethod.easyPayList.forEach((easyPay) => {
              this.easyPaymentList.push(easyPay);
            });
          }
        });

        devLog('easy payment list : ' + this.easyPaymentList);

        /**
         * 주문 상품정보 체크
         * orderValidStatus 값이 false 라면 장바구니로 라우팅
         */
        this.orderProductInfo.forEach((data) => {
          if (data.orderValidStatus !== 'VALID') {
            this.root.alert.showAlert({
              content: data.orderValidMessage,
              onConfirm: () => {
                pushRoute('/shoppingcart');
              },
            });
          }
        });

        /**
         * 기본 배송지가 없다면
         * 신규 배송지 등록 화면이 바로 나오도록 해당 데이터 값 세팅
         */
        if (!this.orderShippingList.defaultAddress) {
          this.status.selectedShipStatus = false;
        }

        if (this.orderUserInfo.refundBankAccountNumber) {
          this.status.refundBankAccount = true;
        }

        /**
         * 결제 시도시 결제중임을 체크하기위에 세션스토리지에 값을 저장시킴
         * 주문서 페이지 로드시 결제가 취소 되었는지 세션스토리지에서 값을 찾아 체크
         */
        let paymentRemainCheck = JSON.parse(
          sessionStorage.getItem('paymentInfo')
        );
        if (paymentRemainCheck) {
          this.status.paymentProceed = true;
          let resultMsg = getParameterByName('resultMsg');
          this.root.alert.showAlert({
            content: resultMsg || '결제가 취소되었습니다',
            onConfirm: () => {
              this.status.paymentProceed = false;
              sessionStorage.removeItem('paymentInfo');
            },
          });
          // window.scrollTo(0, paymentRemainCheck.wScroll);
          // if (!paymentRemainCheck.shippingType) {
          //   this.status.selectedShipStatus = true;
          //   this.orderShippingList.newAddress =
          //     paymentRemainCheck.shippingAddress;

          //   this.orderShippingList.newAddress.shippingMessageType === 'SELF'
          //     ? (this.status.newShppingRequestSelfStatus = true)
          //     : (this.status.newShppingRequestSelfStatus = false);

          //   this.orderShippingList.isAddShippingAddress =
          //     paymentRemainCheck.addShippingAddress;

          //   this.orderShippingList.newAddress.defaultAddress =
          //     paymentRemainCheck.shippingAddress.defaultAddress;
          // }

          // this.paymentMethod = paymentRemainCheck.parentMethodCd;
          this.status.orderPaymentAgreement = !this.status
            .orderPaymentAgreement;
        }

        if (
          this.orderInfo.shippingPassNumber === true &&
          this.orderInfo.personalPassNumber != null
        ) {
          this.customIdNumber = this.orderInfo.personalPassNumber;
        }

        this.status.pageStatus = true;
        window.history.replaceState(
          {},
          null,
          `orderpayment?cartList=${this.cartList}`
        );
      })
      .catch((err) => {
        devLog(err, 'err');
      });
  };

  /*
    주문 결제 금액 정보를 위한 로직
  */

  @action
  getPaymentInfo = (closeCouponModal = true) => {
    devLog('[OrderPaymentStore] - getPaymentInfo called.');
    let cartItemPayments = [];
    cartItemPayments = this.tempSelectedCouponList.map((data) => {
      return {
        cartItemId: Number(data.cartId),
        couponNumber: data.couponNumber,
      };
    });
    API.order
      .post(`/order/calculate-payment-info?`, {
        cartItemPayments,
        consumptionPoint: this.usePoint,
      })
      .then((res) => {
        let data = res;
        this.orderSidetabTotalInfo = data.data.data;
        if (this.status.loadingStatus) {
          this.updateCouponInfo(this.cartList, closeCouponModal);
        }

        if (!this.status.pageStatus) {
          this.status.pageStatus = true;
        }
        devLog(toJS(this.orderSidetabTotalInfo), '결제정보창');
      })
      .catch((err) => {
        console.error(err);
        let message = _.get(err, 'data.message');
        if (message) {
          this.root.alert.showAlert({
            content: message,
          });
        }
        this.status.loadingStatus = false;
      });
  };

  //--------------------- 우편번호 검색 ---------------------
  @action
  searchZipcode = (path, addressEditing, setNewShippingAddress) => {
    daum.postcode.load(function() {
      new daum.Postcode({
        oncomplete: function(data) {
          switch (path) {
            case '주문페이지-신규':
              setNewShippingAddress(null, 'address', data);
              break;
            case '주문페이지-수정':
              addressEditing(null, 'address', data);
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

      case 'address':
        this.orderShippingList.newAddress.address =
          address.jibunAddress === ''
            ? address.autoJibunAddress
            : address.jibunAddress;
        this.orderShippingList.newAddress.zip = address.zonecode;
        this.orderShippingList.newAddress.roadAddress =
          address.roadAddress === ''
            ? address.autoRoadAddress
            : address.roadAddress;
        this.addressType = address.userSelectedType;
        break;
      default:
        break;
    }
  };

  //--------------------- 신규주소 focusing check ---------------------
  @action
  newShippingAddressFocusingCheck = (target) => {
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
    devLog(toJS(shippingOption), 'shippingOption');
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
  setPaymentMethod = (targetMethod) => {
    devLog('target payment method : ' + targetMethod);
    this.paymentMethod = targetMethod;
    this.methodChange();
  };
  //--------------------- 결제방법변경 모듈 ---------------------
  methodChange = () => {
    this.status.VBank = false;
    this.status.cashReceipt = false;
    this.status.cashReceiptRequest = false;
    this.status.EasyPayment = false;

    switch (this.paymentMethod) {
      case 'Card':
        this.receiptDataInit();
        break;
      case 'DirectBank':
        this.status.cashReceipt = true;
        break;
      case 'VBank':
        this.status.cashReceipt = true;
        this.status.VBank = true;
        break;
      case 'TOKEN':
        this.receiptDataInit();
        break;
      case 'EASY':
      case 'EasyPayment':
      case 'NAVER':
      case 'SAMSUNGPAY':
      case 'LPAY':
      case 'SSGPAY':
      case 'TOSS':
      case 'KAKAO':
      case 'PAYCO':
        this.status.EasyPayment = true;
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
      .then((res) => {
        let data = res.data;
        this.orderShippingList.list = data.data;

        this.orderShippingList.list.forEach((data) => {
          data.recipientMobile = autoHypenPhone(data.recipientMobile);
          if (data.defaultAddress) {
            this.orderShippingList.currentUseAddressId = data.id;
          }
        });
        this.status.shppingListModalStatus = true;
      })
      .catch((err) => {
        devLog(err);
        this.status.shppingListModalStatus = true;
        this.status.addressSelf = true;
      });
  };
  //--------------------- 배송지목록 선택 변경(로컬) ---------------------
  @action
  shippingAddressChange = (changeValue) => {
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
      this.orderShippingList.list.forEach((data) => {
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
  addressEdit = (id) => {
    this.orderShippingList.currentUseAddressId = id;
    this.orderShippingList.currentEditAddressId = id;

    this.orderShippingList.list.forEach((data) => {
      if (data.id === id) {
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
      case 'address':
        this.orderShippingList.tempEditAddress.address =
          address.jibunAddress === ''
            ? address.autoJibunAddress
            : address.jibunAddress;
        this.orderShippingList.tempEditAddress.zip = address.zonecode;
        this.orderShippingList.tempEditAddress.roadAddress =
          address.roadAddress === ''
            ? address.autoRoadAddress
            : address.roadAddress;
        this.addressType = address.userSelectedType;
        break;
      default:
        break;
    }
  };

  //--------------------- 배송지 목록 수정 저장(DB) ---------------------
  @action
  addressEditSave = (id) => {
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
      .then((res) => {
        if (res.data.resultCode === 200) {
          this.orderShippingList.list.forEach((list, index) => {
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
  addressDeleteConfirm = (id) => {
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

  addressDelete = (targetId) => {
    API.user
      .delete(
        `/users/${
          this.orderUserInfo.id
        }/shipping-addresses?shippingAddressId=${targetId}`
      )
      .then((res) => {
        this.root.alert.showAlert({
          content: '배송지 삭제완료.',
        });
        this.orderShippingList.list.forEach((data, index) => {
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
      .catch((err) => {
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
    } else if (
      !this.orderShippingList.newAddress.address &&
      !this.orderShippingList.newAddress.roadAddress
    ) {
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
  setCashReceiptHandler = (value) => {
    this.status.cashReceiptRequest = value;
  };

  @action
  setCashReceiptUsage = (value) => {
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

  @action
  addOtherRequest = (e) => {
    this.orderShippingList.otherRequest = e.target.value;

    // devLog(this.orderShippingList.otherRequest, '기타요청사항');
  };

  @action
  customIdNumberChangeHandler = (customIdValue) => {
    this.customIdNumber = customIdValue;
  };

  @action
  customIdNumberAgreeChangeHandler = (isChecked) => {
    this.customIdNumberAgreed = isChecked;
  };

  //--------------------- 결제요청 ---------------------
  @action
  payment = () => {
    let cartList = this.getCartList();

    /**
     * 유저및 결제 수단 유효성 체크
     */
    if (!this.root.customerauthentication.userVerify) {
      this.root.alert.showAlert({
        content: '[필수] 본인인증을 해주세요.',
      });
      return false;
    } else if (!this.paymentMethod) {
      this.root.alert.showAlert({
        content: '결제수단을 선택해주세요.',
      });
      return false;
    } else if (this.paymentMethod === 'TOKEN') {
      this.root.alert.showAlert({
        content: '토큰결제 현재 사용 불가',
      });
      return false;
    }
    // else if (!this.orderUserInfo.emailVerify) {
    //   this.root.alert.showAlert({
    //     content: '이메일을 인증해주세요.',
    //   });
    //   return false
    // }

    /**
     * 배송지 정보 유효성 체크
     * 기본 배송지가 없을 경우
     */
    if (!this.status.selectedShipStatus) {
      if (!this.orderShippingList.newAddress.shippingName) {
        this.root.alert.showAlert({
          content: '배송지이름을 입력해주세요.',
        });
        this.status.newShippingName = true;
        return false;
      } else if (
        !this.orderShippingList.newAddress.address &&
        !this.orderShippingList.newAddress.roadAddress
      ) {
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
          content: '수령인을 입력해주세요.',
        });
        this.status.newRecipientName = true;
        return false;
      } else if (!this.orderShippingList.newAddress.recipientMobile) {
        this.root.alert.showAlert({
          content: '수령인의 연락처를 입력해주세요.',
        });
        this.status.newRecipientMobile = true;
        return false;
      } else if (this.orderShippingList.newAddress.recipientMobile) {
        let currentPhoneNum = this.orderShippingList.newAddress.recipientMobile;
        let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
        let regTel = /^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])-?\d{3,4}-?\d{4}$/;

        if (currentPhoneNum.length < 9 || currentPhoneNum.length > 11) {
          this.root.alert.showAlert({
            content: '연락처를 정확히 입력해주세요.',
          });
          this.status.newRecipientMobile = true;
          return false;
        } else if (
          !regPhone.test(currentPhoneNum) &&
          !regTel.test(currentPhoneNum)
        ) {
          this.root.alert.showAlert({
            content: '연락처를 정확히 입력해주세요.',
          });
          this.status.newRecipientMobile = true;
          return false;
        }
      }
      // if (
      //   this.orderShippingList.newAddress.shippingMessage ===
      //   '배송 메세지를 입력해주세요.'
      // ) {
      //   this.root.alert.showAlert({
      //     content: '배송요청사항을 입력해주세요.',
      //   });
      //   return false
      // } else if (!this.orderShippingList.newAddress.shippingMessage) {
      //   this.root.alert.showAlert({
      //     content: '배송요청사항을 선택해주세요.',
      //   });
      //   return false
      // }
    }

    /**
     * 배송지 유효성 체크 기본 배송지가 존재
     */
    if (this.status.selectedShipStatus) {
      if (!this.orderShippingList.defaultAddress.recipientMobile) {
        this.root.alert.showAlert({
          content: '배송지 연락처를 입력해주세요.',
        });
        return false;
      }
    }

    /**
     * 현금영수증 을 신청할 시 데이터 유효성 체크
     */
    if (this.status.cashReceiptRequest) {
      if (this.cashReceiptUsage === 'PERSONAL') {
        for (let n in this.cashReceiptPhone) {
          if (!this.cashReceiptPhone[n]) {
            this.root.alert.showAlert({
              content: '현금영수증 정보를 정확히 입력해주세요',
            });
            return false;
          }
        }
      } else {
        for (let n in this.cashReceiptEntrepreneur) {
          if (!this.cashReceiptEntrepreneur[n]) {
            this.root.alert.showAlert({
              content: '현금영수증 정보를 정확히 입력해주세요',
            });
            return false;
          }
        }
      }
    }

    /**
     * 결제수단이 간편 결제일때 간편 결제 방법(네이버, 카카오등을) 선택하지 않았을때
     */
    if (this.paymentMethod === 'EASY') {
      this.root.alert.showAlert({
        content: '간편 결제를 선택해주세요.',
      });
      return false;
    }

    /**
     * 결제수단이 가상계좌일때 환불계좌 정보 체크
     */
    if (this.status.VBank) {
      if (!this.status.refundBankAccount) {
        this.root.alert.showAlert({
          content: '환불계좌 를 확인해주세요.',
        });
        return false;
      }
    }

    /**
     * 통관번호 입력 validation
     */
    if (this.orderInfo.shippingPassNumber === true) {
      if (this.customIdNumber === null || this.customIdNumber.length === 0) {
        this.root.alert.showAlert({
          content: '신속한 통관처리를 위해 개인 통관 고유번호를 입력해주세요',
        });
        return false;
      } else if (this.customIdNumber.length > 13) {
        this.root.alert.showAlert({
          content: '개인통관 번호는 13자 이하까지 입력 가능합니다',
        });
        return false;
      }

      if (this.customIdNumberAgreed === false) {
        this.root.alert.showAlert({
          content: '개인 통관 번호 수집 동의가 필요합니다',
        });
        return false;
      }
    }

    let cartItemPayments = [];
    cartItemPayments = this.selectedCouponList.map((data) => {
      return {
        cartItemId: Number(data.cartId),
        couponNumber: data.couponNumber,
      };
    });
    let forms; // 결제에 필요한 모든 정보
    if (this.status.cashReceiptRequest) {
      forms = {
        cartItemPayments: cartItemPayments,
        parentMethodCd: this.paymentMethod,
        shippingAddress: this.status.selectedShipStatus
          ? this.orderShippingList.defaultAddress
          : this.orderShippingList.newAddress,
        user: this.orderUserInfo,
        userAgent: getUserAgent(),
        addShippingAddress: this.orderShippingList.isAddShippingAddress,
        shippingType: this.status.selectedShipStatus,
        etcMessage: this.orderShippingList.otherRequest,
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
        refundBankVerification: this.status.refundBankAccount,
        refundBankCode: this.orderUserInfo.refundBankCode,
        refundBankName: this.orderUserInfo.refundBankName,
        refundBankAccountNumber: this.orderUserInfo.refundBankAccountNumber,
        refundBankAccountOwner: this.orderUserInfo.refundBankAccountOwner,
        personalPassNumber: this.customIdNumber,
        web: true,
      };
    } else {
      forms = {
        cartItemPayments: cartItemPayments,
        parentMethodCd: this.paymentMethod,
        shippingAddress: this.status.selectedShipStatus
          ? this.orderShippingList.defaultAddress
          : this.orderShippingList.newAddress,
        user: this.orderUserInfo,
        userAgent: getUserAgent(),
        addShippingAddress: this.orderShippingList.isAddShippingAddress,
        shippingType: this.status.selectedShipStatus,
        etcMessage: this.orderShippingList.otherRequest,
        consumptionPoint: this.usePoint,
        refundBankVerification: this.status.refundBankAccount,
        refundBankCode: this.orderUserInfo.refundBankCode,
        refundBankName: this.orderUserInfo.refundBankName,
        refundBankAccountNumber: this.orderUserInfo.refundBankAccountNumber,
        refundBankAccountOwner: this.orderUserInfo.refundBankAccountOwner,
        personalPassNumber: this.customIdNumber,
        web: true,
      };
    }

    /**
     * NAVER_PAY 치환 업데이트
     */
    if (forms.parentMethodCd === 'NAVER') {
      forms.parentMethodCd = 'DIRECT_NAVER';
    }

    devLog(forms, 'forms');

    // handle pid by direct_payment or indirect_payment
    if (sessionStorage.getItem('pid')) {
      let directPayment = 0;
      this.orderProductInfo.forEach((element) =>
        element.dealId === parseInt(sessionStorage.getItem('dealIdByPid'))
          ? (directPayment = 1)
          : (directPayment = 0)
      );
      forms.affiliateExtraId = JSON.parse(sessionStorage.getItem('pid'));
      forms.directOrder = directPayment;
    }

    API.order
      .post(`/order/requestOrder`, forms) // FLAG
      .then((res) => {
        let data = res.data.data;
        const query = qs.stringify({
          cartList:
            typeof cartList === 'object' ? cartList.join(',') : cartList,
        });

        //현재 mWeb 에서는 사용 x next url 로 데이터가 들어옴
        let returnUrl = `${HOSTNAME}/privyCertifyResult?` + query;

        /**
         * pg 사에 리턴해주는 데이터를 다루기 위한 next url
         * 취소시 돌아오기위해 상품 정보를 파라미터로 담음
         */
        let nextUrl = `${HOSTNAME}/privyCertifyResult?${data.pgOid}&` + query;

        devLog(nextUrl, returnUrl, 'nextUrl & returnUrl');
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
          /* items below are for NAVER_PAY */
          pgKind: data.pgKind,
        };

        forms.wScroll = window.scrollY;
      })
      .catch((err) => {
        devLog(err);
        this.root.alert.showAlert({
          content: `${_.get(err, 'data.message') || '결제 오류'}`,
        });
        this.status.paymentProceed = false;
      });
  };

  @action
  paymentStart = () => {
    // euc-kr 로 form 전달해야함. 설정은 해당 컴포넌트에서 진행중
    this.status.paymentProceed = true;
    sessionStorage.setItem('paymentInfo', this.status.paymentProceed);
    let form = document.getElementById('paymentForm');

    /**
     * NAVER_PAY 전용 분기
     */
    if (
      this.paymentForm.gopaymethod === 'NAVER' ||
      this.paymentForm.gopaymethod === 'DIRECT_NAVER'
    ) {
      const cartList = this.getCartList();
      const query = qs.stringify({
        cartList: typeof cartList === 'object' ? cartList.join(',') : cartList,
      });
      const returnUrl = `${HOSTNAME}/returnUrl/directPrivyCertify?` + query;

      const mode =
        isDev || HOSTNAME !== 'https://m.guhada.com'
          ? 'development'
          : 'production';
      const pgMid = this.paymentForm.mid;
      const pgOid = this.paymentForm.oid;
      const prodNm = this.paymentForm.goodname;
      const today = moment(this.paymentForm.timestamp, 'x').format('YYYYMMDD');
      const amount = this.paymentForm.price;

      // 네이버 페이 결제 완료 후 결제 정보 DirectPrivyCertifyPage로 전달하기 위한 용도
      const approvalData = {
        resultCode: '00',
        // resultMsg,
        // cno,
        pgKind: this.paymentForm.pgKind,
        pgMid,
        pgOid,
        pgAmount: amount,
        // returnUrl,
        parentMethodCd: 'DIRECT_NAVER',
        purchaseEmail: this.paymentForm.buyeremail,
        purchaseUserName: this.paymentForm.buyername,
        purchasePhone: this.paymentForm.buyertel,
        productName: prodNm,
        web: false,
      };

      function executeNaverPay() {
        try {
          const oPay = Naver.Pay.create({
            mode,
            clientId: 'sQuFDcxgUfyPvUSX7j4W',
            useNaverAppLogin: true,
          });

          sessionStorageImpl.set('approvalData', approvalData);

          oPay.open({
            merchantUserKey: pgMid,
            merchantPayKey: pgOid,
            productName: prodNm,
            useCfmYmdt: today,
            totalPayAmount: amount,
            taxScopeAmount: amount,
            taxExScopeAmount: 0,
            returnUrl: returnUrl,
          });
        } catch (error) {
          if (sessionStorageImpl.get('approvalData')) {
            sessionStorageImpl.remove('approvalData');
          }
          console.error(error.message);
        }
      }

      loadScript('https://nsp.pay.naver.com/sdk/js/naverpay.min.js', {
        id: 'NAVER_PAY',
        replaceExisting: true,
        onLoad: executeNaverPay,
      });

      return;
    }

    form.action = this.paymentForm.jsUrl;

    form.submit();
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
      otherRequest: null,
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
      loadingStatus: false,
      VBank: false,
    };
    this.paymentMethod = 'Card';
    this.orderCouponInfo = null;
    this.orderInfo = {};
    this.shippingListModalClose();
    this.couponModalClose();

    this.root.customerauthentication.sendMailSuccess = false;
    this.root.orderPaymentBenefit.myCoupon = 0;
    this.totalCouponDiscount = 0;
    this.selectedCouponList = [];
    this.tempSelectedCouponList = [];
    this.customIdNumber = '';
    this.customIdNumberAgreed = false;
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
      .map((data) => {
        return {
          value: data.message === '배송 메시지를 입력해주세요.' ? true : false,
          label: data.message,
        };
      })
      .filter((opt) => opt.value !== 'NONE');
  };

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
  emailValidCheck = (email) => {
    if (isEmailString(email) === false) {
      this.root.customerauthentication.emailValid = false;
    } else {
      this.root.customerauthentication.emailValid = true;
      this.root.customerauthentication.email = email;
    }
  };

  @action
  userAuthenticationCheck = () => {
    API.user
      .get(`/users/${this.orderUserInfo.id}`)
      .then((res) => {
        this.root.customerauthentication.userVerify =
          res.data.data.userDetail.diCode;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  @action
  getCouponInfo = (cartList) => {
    API.gateway
      .get(`/benefits/order/coupon?cartItemIdSet=${cartList}`)
      .then((res) => {
        this.orderCouponInfo = res.data.data;

        devLog(toJS(this.orderCouponInfo), 'orderCouponInfo');
        this.setInitCouponInfo();
        this.getPaymentInfo();
      })
      .catch((err) => {
        console.error(err);
      });
  };
  @action
  couponModalShow = () => {
    // if (!this.orderCouponInfo.availableCouponCount) {
    //   this.root.alert.showAlert({
    //     content: `적용가능한 쿠폰이 없습니다.`,
    //   });
    //   return false;
    // }
    this.status.couponSelectModal = true;
  };

  @action
  couponModalClose = () => {
    this.status.couponSelectModal = false;
    // this.updateCouponInfo(this.cartList);
  };

  /**
   * 사용할 쿠폰 선택
   */
  @action
  setSelectCoupon = ({
    cartId = 0,
    sellerId = 0,
    couponNumber = '',
    couponDiscountPrice = 0,
  }) => {
    // 데이터 변경을 위해 배교하는 임시 객체
    let tempObj = {
      cartId,
      sellerId,
      couponNumber,
      couponDiscountPrice,
    };

    /**
     * 데이터 변경 비교를 위해 선택된 쿠폰을 임시로 저장
     */

    if (this.tempSelectedCouponList.length === 0) {
      this.tempSelectedCouponList = this.tempSelectedCouponList.concat(tempObj);
    } else {
      for (let i = 0; i < this.tempSelectedCouponList.length; i++) {
        if (this.tempSelectedCouponList[i].cartId === cartId) {
          this.tempSelectedCouponList.splice(i, 1); // 비교되는 값이 한개 이기 때문에 바로 splice 로 배열을 변경
        }
      }
      this.tempSelectedCouponList = this.tempSelectedCouponList.concat(tempObj);
    }

    let tempArr = [];
    tempArr = JSON.parse(JSON.stringify(this.orderCouponInfo));

    /**
     * 쿠폰 선택 을 비교 하고 선택된 쿠폰을 저장하는 로직
     * api 에서 내려온 쿠폰 과 상품 정보를 탐색하며 현재 선택한 쿠폰과 비교하고
     * 데이터를 저장
     */
    for (let i = 0; i < tempArr.benefitSellerResponseList.length; i++) {
      if (tempArr.benefitSellerResponseList[i].sellerId === sellerId) {
        // 현재 선택한 쿠폰의 셀러와 일치한지 ?
        for (
          let z = 0;
          z <
          tempArr.benefitSellerResponseList[i].benefitOrderProductResponseList
            .length;
          z++
        ) {
          if (
            // 현재 선택한 쿠폰이 해당 상품과 일치한지 ?
            tempArr.benefitSellerResponseList[i]
              .benefitOrderProductResponseList[z].cartId === cartId
          ) {
            for (
              let j = 0;
              j <
              tempArr.benefitSellerResponseList[i]
                .benefitOrderProductResponseList[z]
                .benefitProductCouponResponseList.length;
              j++
            ) {
              if (
                // 현재 선택한 쿠폰이 해당 상품에 바인딩된 쿠폰 넘버와 일치 한지 ?
                tempArr.benefitSellerResponseList[i]
                  .benefitOrderProductResponseList[z]
                  .benefitProductCouponResponseList[j].couponNumber ===
                couponNumber
              ) {
                tempArr.benefitSellerResponseList[
                  i
                ].benefitOrderProductResponseList[
                  z
                ].benefitProductCouponResponseList[j].selected = true;
              } else {
                tempArr.benefitSellerResponseList[
                  i
                ].benefitOrderProductResponseList[
                  z
                ].benefitProductCouponResponseList[j].selected = false;
              }
            }
          } else if (
            // 현재 선택한 쿠폰이 해당 상품과 일치하지 않는다면 나머지 상품들의 쿠폰 활성여부를 체크
            tempArr.benefitSellerResponseList[i]
              .benefitOrderProductResponseList[z].cartId !== cartId
          ) {
            for (
              let j = 0;
              j <
              tempArr.benefitSellerResponseList[i]
                .benefitOrderProductResponseList[z]
                .benefitProductCouponResponseList.length;
              j++
            ) {
              if (
                tempArr.benefitSellerResponseList[i]
                  .benefitOrderProductResponseList[z]
                  .benefitProductCouponResponseList[j].couponNumber ===
                couponNumber
              ) {
                tempArr.benefitSellerResponseList[
                  i
                ].benefitOrderProductResponseList[
                  z
                ].benefitProductCouponResponseList[j].selected = false;
                tempArr.benefitSellerResponseList[
                  i
                ].benefitOrderProductResponseList[
                  z
                ].benefitProductCouponResponseList[j].disable = true;
              } else {
                if (
                  tempArr.benefitSellerResponseList[i]
                    .benefitOrderProductResponseList[z]
                    .benefitProductCouponResponseList[j].disable === true
                ) {
                  let check = this.tempSelectedCouponList.findIndex(
                    (data) =>
                      data.couponNumber ===
                      tempArr.benefitSellerResponseList[i]
                        .benefitOrderProductResponseList[z]
                        .benefitProductCouponResponseList[j].couponNumber
                  );

                  if (check === -1) {
                    tempArr.benefitSellerResponseList[
                      i
                    ].benefitOrderProductResponseList[
                      z
                    ].benefitProductCouponResponseList[j].disable = false;
                  }
                }
              }
            }
          }
        }
      }
    }

    this.orderCouponInfo = tempArr;

    this.couponDiscountCalculator();
  };

  /**
   * 주문서 최초 진입시
   * 사용할 값들을 미리 가공
   */
  setInitCouponInfo = () => {
    this.selectedCouponList = [];
    this.selectedCouponList = this.orderProductInfo.map((data) => {
      return {
        cartId: data.cartItemId,
        sellerId: 0,
        couponNumber: '',
        couponDiscountPrice: 0,
      };
    });

    this.tempSelectedCouponList = [];
    this.tempSelectedCouponList = this.orderProductInfo.map((data) => {
      return {
        cartId: data.cartItemId,
        sellerId: 0,
        couponNumber: '',
        couponDiscountPrice: 0,
      };
    });

    let tempArr = [];
    tempArr = JSON.parse(JSON.stringify(this.orderCouponInfo));
    for (let i = 0; i < tempArr.benefitSellerResponseList.length; i++) {
      for (
        let z = 0;
        z <
        tempArr.benefitSellerResponseList[i].benefitOrderProductResponseList
          .length;
        z++
      ) {
        for (
          let j = 0;
          j <
          tempArr.benefitSellerResponseList[i].benefitOrderProductResponseList[
            z
          ].benefitProductCouponResponseList.length;
          j++
        ) {
          if (
            tempArr.benefitSellerResponseList[i]
              .benefitOrderProductResponseList[z]
              .benefitProductCouponResponseList[j].selected
          ) {
            let tempObj = {
              cartId:
                tempArr.benefitSellerResponseList[i]
                  .benefitOrderProductResponseList[z].cartId,
              sellerId:
                tempArr.benefitSellerResponseList[i]
                  .benefitOrderProductResponseList[z]
                  .benefitProductCouponResponseList[j].sellerId,
              couponNumber:
                tempArr.benefitSellerResponseList[i]
                  .benefitOrderProductResponseList[z]
                  .benefitProductCouponResponseList[j].couponNumber,
              couponDiscountPrice:
                tempArr.benefitSellerResponseList[i]
                  .benefitOrderProductResponseList[z]
                  .benefitProductCouponResponseList[j].couponDiscountPrice,
            };

            for (let i = 0; i < this.selectedCouponList.length; i++) {
              if (this.selectedCouponList[i].cartId === tempObj.cartId) {
                this.selectedCouponList.splice(i, 1); //선택된 값은 한개이기 때문에 배열을 바로 변경
              }
            }

            for (let i = 0; i < this.tempSelectedCouponList.length; i++) {
              if (this.tempSelectedCouponList[i].cartId === tempObj.cartId) {
                this.tempSelectedCouponList.splice(i, 1); //선택된 값은 한개이기 때문에 배열을 바로 변경
              }
            }

            this.selectedCouponList = this.selectedCouponList.concat(tempObj);
            this.tempSelectedCouponList = this.tempSelectedCouponList.concat(
              tempObj
            );

            this.couponDiscountCalculator();
          }
        }
      }
    }
  };

  /**
   * 쿠폰 할인 금액 계싼
   */
  couponDiscountCalculator = () => {
    devLog('[OrderPaymentStore] - couponDiscountCalculator called.');
    this.totalCouponDiscount = 0;
    this.totalDiscountPrice = 0;
    this.totalCouponUsedCount = 0;

    let appliedCouponPriceSum = 0;
    let appliedCouponCount = 0;
    if (this.orderSidetabTotalInfo.discountInfoResponseList) {
      this.orderSidetabTotalInfo.discountInfoResponseList.forEach(function(
        element
      ) {
        if (element.discountType === 'COUPON_DISCOUNT') {
          appliedCouponPriceSum += element.discountPrice;
          appliedCouponCount++;
        }
      });
    }

    this.totalCouponDiscount = appliedCouponPriceSum;
    this.totalCouponUsedCount = appliedCouponCount;

    this.totalDiscountPrice =
      this.orderCouponInfo.totalProductPrice - this.totalCouponDiscount;
  };

  @action
  couponApply = (closeCouponModal = true) => {
    devLog('[OrderPaymentStore] - couponApply called.');
    this.status.loadingStatus = true;
    this.getPaymentInfo(closeCouponModal);
    this.selectedCouponList = this.tempSelectedCouponList;
  };

  updateCouponInfo = (cartList, closeCouponModal = true) => {
    devLog('[OrderPaymentStore] - updateCouponInfo called.');
    API.gateway
      .get(`/benefits/order/coupon?cartItemIdSet=${cartList}`)
      .then((res) => {
        this.orderCouponInfo = res.data.data;
        devLog(this.orderCouponInfo, 'update');
        if (closeCouponModal) this.couponModalClose();
        this.couponDiscountCalculator();
        this.status.loadingStatus = false;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  @action
  bankNameSelect = (value) => {
    this.orderUserInfo.refundBankName = value.label;
    this.orderUserInfo.refundBankCode = value.value;
    this.status.refundBankAccount = false;
  };

  @action
  setAccountInfo = (e) => {
    this.status.refundBankAccount = false;
    if (e.target.name === 'bankAccount') {
      this.orderUserInfo.refundBankAccountNumber = e.target.value;
    }
  };

  @action
  verifyAccount = () => {
    if (
      this.orderUserInfo.refundBankCode &&
      this.orderUserInfo.refundBankAccountNumber
    ) {
      this.status.loadingStatus = true;
      accountService
        .accountCheck({
          bankCode: this.orderUserInfo.refundBankCode,
          bankNumber: this.orderUserInfo.refundBankAccountNumber,
          name: this.orderUserInfo.refundBankAccountOwner,
        })
        .then(({ data }) => {
          devLog(`accountCheck`, data);

          if (data.data.result) {
            this.root.alert.showAlert({
              content: '계좌 확인완료',
            });
            this.status.refundBankAccount = true;
            this.orderUserInfo.refundBankAccountOwner = data.data.name;
          } else {
            this.root.alert.showAlert({
              content: '계좌 정보를 확인해 주세요.',
            });
            this.status.refundBankAccount = false;
            this.orderUserInfo.refundBankAccountOwner = data.data.name;
          }

          this.status.loadingStatus = false;
        })
        .catch((e) => {
          console.error(e);
          this.root.alert.showAlert({
            content: e.data.message,
          });
          this.status.loadingStatus = false;
        })
        .finally(() => {});
    }
  };
}

/* eslint-disable no-undef */
import { observable, action } from 'mobx';
import { autoHypenPhone, getUserAgent } from '../../utils';
import API from 'lib/API';
import qs from 'qs';
import { getParameterByName } from '../../utils';
import Router from 'next/router';
import { loadScript } from 'lib/dom';

const isServer = typeof window === 'undefined';
export default class OrderPaymentStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable cartList;
  @observable orderPaymentTotalInfo;
  @observable orderProductInfo;
  @observable orderUserInfo;
  @observable orderPoint;
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
      shippingMessageType: null,
      defaultAddress: false,
    },
    isAddShippingAddress: false,
  };
  @observable status = {
    pageStatus: false,
    selectedShipStatus: false,
    shppingRequestSelfStatus: false,
    newShppingRequestSelfStatus: false,
    shppingListModalStatus: false,
    totalBenefitDetailStatus: false,
    totalDiscountDetailStatus: false,
    orderPaymentAgreement: false,
    paymentProceed: false,
    newShippingName: false,
    newAddress: false,
    newDetail: false,
    newRecipientName: false,
    newRecipientMobile: false,
    orderProductOnOffStatus: true,
  };
  @observable orderTotalQuantity = 0;
  @observable shippingMessageOption = [];
  @observable option = [];
  @observable paymentMethod;

  @observable paymentForm = {};

  @observable paymentMethodStyle = {
    background: '#5d2ed1',
    color: '#fff',
  };

  //--------------------- 주문페이지 토탈 데이터 최초 바인딩 ---------------------
  @action
  getOrderItems = cartList => {
    this.cartList = cartList;
    API.order
      .get(`/order/orderForm?cartItemIdList=${this.cartList}`)
      .then(res => {
        let data = res.data.data;
        if (res.data.resultCode === 200) {
          this.orderPaymentTotalInfo = data;
          this.orderProductInfo = data.orderItemList;
          this.orderUserInfo = data.user;
          this.orderShippingList.defaultAddress = data.shippingAddress;
          this.orderPoint = data.availablePointResponse;
          this.orderPaymentTotalInfo.originPaymentPrice = this.orderPaymentTotalInfo.totalPaymentPrice; //총 결제금액 백업 저장
          this.shippingMessageOption = data.shippingMessage;
          this.getOptions();
          this.getTotalQuantity();
          this.getShippingMessageOption();
          console.log(res.data, '주문 데이터');
          this.orderProductInfo.map(data => {
            if (data.orderValidStatus !== 'VALID') {
              this.root.alert.showAlert({
                content:
                  '구매에 유효하지 않은 상품이 있습니다, 장바구니 로 돌아갑니다.',
                onConfirm: () => {
                  Router.push('/shoppingcart');
                },
              });
            }
          });
          if (this.orderShippingList.defaultAddress) {
            this.status.selectedShipStatus = true;
          }
          this.getPhoneWithHypen();

          let paymentRemainCheck = JSON.parse(
            sessionStorage.getItem('paymentInfo')
          );

          if (paymentRemainCheck) {
            let resultMsg = getParameterByName('resultMsg');
            this.root.alert.showAlert({
              content: resultMsg || '결제 실패.',
            });
            window.scrollTo(0, paymentRemainCheck.wScroll);
            if (!paymentRemainCheck.shippingType) {
              this.status.selectedShipStatus = false;
              this.orderShippingList.newAddress =
                paymentRemainCheck.shippingAddress;

              this.orderShippingList.newAddress.shippingMessageType === 'SELF'
                ? (this.status.newShppingRequestSelfStatus = true)
                : (this.status.newShppingRequestSelfStatus = false);

              this.orderShippingList.isAddShippingAddress =
                paymentRemainCheck.addShippingAddress;

              this.orderShippingList.newAddress.defaultAddress =
                paymentRemainCheck.shippingAddress.defaultAddress;
            }

            this.paymentMethod = paymentRemainCheck.parentMethodCd;
            this.status.orderPaymentAgreement = !this.status
              .orderPaymentAgreement;

            sessionStorage.removeItem('paymentInfo');
          }
          this.status.pageStatus = true;
        }
      })
      .catch(err => {
        this.root.alert.showAlert({
          content: `${err}`,
          onConfirm: () => {
            this.gotoMain();
          },
        });
      });
  };
  gotoMain = () => {
    Router.push('/');
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
                console.log(data, '우편데이터');
                document.getElementById('newAddress').value = `(우:${
                  data.zonecode
                }) ${data.jibunAddress}`;
                setNewShippingAddress(null, 'address', data);
              } else {
                document.getElementById('newAddress').value = `(우:${
                  data.zonecode
                }) ${data.roadAddress}`;
                setNewShippingAddress(null, 'roadAddress', data);
              }
              break;
            case '주문페이지-수정':
              if (data.userSelectedType === 'J') {
                addressEditing(null, 'address', data);
                document.getElementById('order__payment__edit__address').value =
                  data.jibunAddress;
              } else {
                addressEditing(null, 'roadAddress', data);
                document.getElementById('order__payment__edit__address').value =
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
      this.orderShippingList.defaultAddress.shippingMessageType =
        shippingOption.value;
      this.orderShippingList.defaultAddress.shippingMessage =
        shippingOption.label;

      this.orderShippingList.defaultAddress.shippingMessageType == 'SELF'
        ? (this.status.shppingRequestSelfStatus = true)
        : (this.status.shppingRequestSelfStatus = false);
    } else {
      this.orderShippingList.newAddress.shippingMessageType =
        shippingOption.value;
      this.orderShippingList.newAddress.shippingMessage = shippingOption.label;

      this.orderShippingList.newAddress.shippingMessageType === 'SELF'
        ? (this.status.newShppingRequestSelfStatus = true)
        : (this.status.newShppingRequestSelfStatus = false);
    }

    // console.log(
    //   this.orderShippingList.defaultAddress,
    //   this.orderShippingList.newAddress
    // );
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
    } else {
      this.orderShippingList.isAddShippingAddress = bool;
    }
  };

  //--------------------- 주문상품 옵션 데이터 가져오기 ---------------------
  getOptions = () => {
    let tempAttribute = '';
    let tempArray = [];
    let branchArray = [];

    this.orderProductInfo.map((data, index) => {
      tempAttribute = '';
      tempArray = [];
      for (let key in data.itemOptionResponse) {
        if (key.indexOf('attribute') !== -1) {
          if (data.itemOptionResponse[key] !== null) {
            tempArray.push(data.itemOptionResponse[key]);
          }
        }
      }
      for (let x = 0; x < tempArray.length; x++) {
        tempAttribute += tempArray[x] + '/';
      }
      tempAttribute = tempAttribute.substr(0, tempAttribute.length - 1);

      if (tempAttribute == '') {
        branchArray.push('옵션없는상품');
      } else {
        branchArray.push(tempAttribute);
      }
    });
    this.option = branchArray;
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

  //--------------------- 휴대폰번호에 ' - ' 추가 ---------------------
  getPhoneWithHypen = () => {
    this.orderUserInfo.mobile = autoHypenPhone(this.orderUserInfo.mobile);
    if (this.orderShippingList.defaultAddress) {
      this.orderShippingList.defaultAddress.hypenRecipientMobile = autoHypenPhone(
        this.orderShippingList.defaultAddress.recipientMobile
      );
    }
  };

  //--------------------- 결제방법변경 ---------------------
  @action
  setPaymentMethod = targetMethod => {
    this.paymentMethod = targetMethod;
    console.log(this.paymentMethod, 'this.paymentMethod');
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
        if (data.resultCode === 200) {
          this.orderShippingList.list = data.data;

          this.orderShippingList.list.map(data => {
            data.recipientMobile = autoHypenPhone(data.recipientMobile);
            if (data.defaultAddress) {
              this.orderShippingList.currentUseAddressId = data.id;
            }
          });

          this.status.shppingListModalStatus = true;
        }
      });
  };
  //--------------------- 배송지목록 쳌 박스 변경(로컬) ---------------------
  @action
  shippingAddressChange = changeValue => {
    this.orderShippingList.currentUseAddressId = changeValue.target.value;
    this.shippingAddressEditCancel();
  };

  //--------------------- 배송지 적용(Local) ---------------------
  @action
  shippingAddressChangeConfirm = () => {
    if (this.orderShippingList.currentEditAddressId) {
      this.root.alert.showAlert({
        content: '수정중인 주소지를 저장해주세요.',
      });
    } else {
      this.orderShippingList.list.map(data => {
        if (data.id == this.orderShippingList.currentUseAddressId) {
          this.orderShippingList.defaultAddress = data;
        }
      });
      this.shippingListModalClose();
      this.status.selectedShipStatus = true;
    }
  };

  //--------------------- 배송지 목록 수정 데이터 설정(Local) ---------------------
  @action
  shippingAddressEdit = id => {
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
  shippingAddressEditSave = id => {
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
  shippingAddressEditCancel = () => {
    this.orderShippingList.currentEditAddressId = 0;
  };

  //--------------------- 배송지 목록 삭제(DB) ---------------------
  @action
  shippingAddressDelete = id => {
    let targetId = id;

    API.user
      .delete(
        `/users/${
          this.orderUserInfo.id
        }/shipping-addresses?shippingAddressId=${targetId}`
      )
      .then(res => {
        if (res.data.resultCode === 200) {
          this.root.alert.showAlert({
            content: '배송지 삭제완료.',
          });
          this.orderShippingList.list.map((data, index) => {
            if (data.id == targetId) {
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
        }
      });
  };

  @action
  shippingListModalClose = () => {
    this.status.shppingListModalStatus = false;
    this.shippingAddressEditCancel();
  };

  //--------------------- 결제요청 ---------------------
  @action
  payment = () => {
    let cartList = this.getCartList();

    if (!this.paymentMethod) {
      this.root.alert.showAlert({
        content: '결제수단을 선택해주세요.',
      });
      return false;
    } else if (this.paymentMethod === 'TOKEN') {
      this.root.alert.showAlert({
        content: '토큰결제 현재 사용 불가',
      });
      return false;
    } else if (!this.status.orderPaymentAgreement) {
      this.root.alert.showAlert({
        content: '구매 및 결제대행서비스 이용약관 등에 모두 동의해주세요.',
      });
      return false;
    } else if (!this.orderUserInfo.emailVerify) {
      this.root.alert.showAlert({
        content: '이메일을 인증해주세요.',
      });
      return false;
    } else if (!this.status.selectedShipStatus) {
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
          content: '수령인을 입력해주세요.',
        });
        this.status.newRecipientName = true;
        return false;
      } else if (!this.orderShippingList.newAddress.recipientMobile) {
        this.root.alert.showAlert({
          content: '수령인 의 연락처를 입력해주세요.',
        });
        this.status.newRecipientMobile = true;
        return false;
      } else if (this.orderShippingList.newAddress.recipientMobile) {
        let currentPhoneNum = this.orderShippingList.newAddress.recipientMobile;
        let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
        if (currentPhoneNum.length < 10 || currentPhoneNum.length > 11) {
          this.root.alert.showAlert({
            content: '휴대폰번호는 10자리 이상 11자리 이하입니다.',
          });
          this.status.newRecipientMobile = true;
          return false;
        } else if (!regPhone.test(currentPhoneNum)) {
          this.root.alert.showAlert({
            content: '휴대폰번호 를 정확히 입력해주세요.',
          });
          this.status.newRecipientMobile = true;
          return false;
        }
      } else if (!this.orderShippingList.newAddress.shippingMessageType) {
        this.root.alert.showAlert({
          content: '배송메시지를 선택해주세요.',
        });
        return false;
      } else if (
        this.orderShippingList.newAddress.shippingMessage == '직접입력'
      ) {
        this.root.alert.showAlert({
          content: '배송메시지를 입력해주세요.',
        });
        return false;
      }
    } else if (this.status.selectedShipStatus) {
      if (this.orderShippingList.defaultAddress.shippingMessage == '직접입력') {
        this.root.alert.showAlert({
          content: '배송메시지를 입력해주세요.',
        });
        return false;
      }
    }

    let forms = {
      cartItemIdList: cartList,
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
      consumptionPoint: this.root.orderPaymentPoint.usePoint,
      web: true,
    };
    console.log(forms, 'forms');
    const query = qs.stringify({
      cartList: cartList,
    });

    let returnUrl = `${process.env.HOSTNAME}/privyCertifyResult?` + query;

    API.order
      .post(`order/requestOrder`, forms)
      .then(res => {
        if (res.data.resultCode === 200) {
          this.status.paymentProceed = true;
          let data = res.data.data;
          console.log(data, 'requestOrder return data');

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
            ansim_quota: data.cardQuota,
            ini_onlycardcode: data.methodCd,
            vbankTypeUse: '1',
            quotabase: data.cardQuota,
            returnUrl: returnUrl,
            jsUrl: data.jsUrl,
          };
          sessionStorage.setItem('paymentInfo', JSON.stringify(forms));
        } else {
          this.root.alert.showAlert({
            content: res.data.message
              ? res.data.message
              : '결제오류 상품을 다시 확인해주세요.',
          });
        }
      })
      .catch(error => {
        if (this.root.login.loginStatus === 'logout') {
          this.root.alert.showAlert({
            content: '로그인 을 해주세요.',
          });
        } else {
          this.root.alert.showAlert({
            content: '서버 에러 ' + error,
          });
        }
        this.root.alert.showAlert({
          content: '결제에 실패 하였습니다.',
        });
        console.log(error);
        this.status.paymentProceed = false;
      });
  };

  @action
  paymentStart = () => {
    const action = () => {
      if (window.INIStdPay.pay) {
        window.INIStdPay.pay('paymentForm');
      } else {
        this.root.alert.showAlert({
          content: '결제모듈 불러오기 실패',
          onConfirm: () => {
            this.gotoMain();
          },
        });
      }
    };
    const url = this.paymentForm.jsUrl;
    loadScript(url, { callback: action, async: false, id: 'INIStdPay' });
  };
  @action
  totalBenefitDetailActive = () => {
    this.status.totalBenefitDetailStatus = !this.status
      .totalBenefitDetailStatus;
  };

  @action
  totalDiscountDetailActive = () => {
    this.status.totalDiscountDetailStatus = !this.status
      .totalDiscountDetailStatus;
  };
  @action
  orderPaymentAgreement = () => {
    this.status.orderPaymentAgreement = !this.status.orderPaymentAgreement;
  };

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
    this.status = {
      pageStatus: false,
      selectedShipStatus: false,
      shppingRequestSelfStatus: false,
      newShppingRequestSelfStatus: false,
      shppingListModalStatus: false,
      totalBenefitDetailStatus: false,
      orderPaymentAgreement: false,
      paymentProceed: false,
      newShippingName: false,
      newAddress: false,
      newDetail: false,
      newRecipientName: false,
      newRecipientMobile: false,
    };
    this.paymentMethod = null;

    this.orderPoint = null;
    this.root.orderPaymentPoint.usePoint = 0;
    this.shippingListModalClose();
  };

  /*
    주문 포인트 스토어와 연결됨
  */
  @action
  totalPaymentAmount = point => {
    this.orderPaymentTotalInfo.totalPaymentPrice =
      this.orderPaymentTotalInfo.originPaymentPrice - point;
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
          value: data.type,
          label: data.message,
        };
      })
      .filter(opt => opt.value !== 'NONE');
  };
}

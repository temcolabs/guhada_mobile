import { observable, action, toJS, computed } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import { autoHypenPhone } from '../../utils';
import _ from 'lodash';
import openDaumAddressSearch from 'lib/common/openDaumAddressSearch';
import { devLog } from 'lib/common/devLog';
import { applyInitialData } from 'store';

export default class MypageAddressStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }

    applyInitialData({
      initialData,
      storeName: 'mypageAddress',
      store: this,
    });
  }

  @observable isModalOpen = false;
  @observable isNewAdressModal = true; // 신규 배송지를 등록하는 모달인지. false면 수정
  @observable addressList = []; // 내 배송지 목록.
  @observable pageStatus = false;
  // 새 주소 데이터
  @observable newAddress = {
    shippingName: null,
    address: null,
    roadAddress: null,
    zip: null,
    detailAddress: null,
    recipientName: null,
    recipientMobile: null,
    defaultAddress: false,
  };
  @observable addressType = 'R';
  @observable editAddress = {};
  @observable currentCheckedId;
  @observable userId;

  @observable isOrderAddressModalOpen = false; // 주문Order배송지 수정 모달

  // 주문 배송지. user에 저장되는 데이터와 다른 형태를 가짐
  @observable orderAddress = {
    add: false,
    addressBasic: '',
    addressDefault: false,
    addressDetail: '',
    addressName: '',
    id: -1,
    message: '',
    messageCode: '',
    phone: '',
    receiverName: '',
    roadAddress: '',
    safetyNoUse: false,
    zipcode: '',
  };
  @observable orderAddressPurchaseId = null;
  @observable defaultAddress = false;
  @action
  getAddressList = async () => {
    const action = () => {
      this.userId = this.root.user.userInfo.id;

      API.user
        .get(`/users/${this.userId}/shipping-addresses`)
        .then((res) => {
          let { data } = res;
          this.addressList = data.data;
          this.pageStatus = true;
        })
        .catch((err) => {
          console.error(err);
          this.addressList = [];
          // this.root.alert.showAlert({
          //   content: `${_.get(err, 'data.message') || '오류가 발생했습니다.'}`,
          // });
          this.pageStatus = true;
        });
    };

    if (_.isNil(_.get(this.root.user, 'userInfo.id'))) {
      // 유저 정보가 없으면, 유저 정보를 가져온 후 실행할 액션에 추가해준다.
      this.root.user.pushJobForUserInfo(action);
    } else {
      action();
    }
  };

  @action
  changeAddress = (id) => {
    for (let i = 0; i < this.addressList.length; i++) {
      if (this.addressList[i].id === id) {
        this.currentCheckedId = this.addressList[i].id;
      }
    }
  };

  @action
  editAddressModal = (id) => {
    this.isModalOpen = true;
    this.isNewAdressModal = false;

    this.addressList.forEach((address) => {
      if (address.id === id) {
        this.editAddress = { ...address };
      }
    });
  };

  @action
  deleteAddress = (id) => {
    this.root.alert.showConfirm({
      content: '해당 배송지를 삭제하시겠습니까?',
      onConfirm: () => {
        let targetId = id;

        API.user
          .delete(
            `/users/${this.userId}/shipping-addresses?shippingAddressId=${targetId}`
          )
          .then((res) => {
            // 목록 새로고침
            this.getAddressList();
          })
          .catch((err) => {
            console.error(err);
            this.root.alert.showAlert({
              content: `${_.get(err, 'data.message') ||
                '오류가 발생했습니다.'}`,
            });
          });
      },
    });
  };

  @action
  newAddressModal = () => {
    this.isModalOpen = true;
    this.isNewAdressModal = true;
    this.editAddress = {};
  };

  @action
  addressModalClose = () => {
    this.isModalOpen = false;
    this.newAddress = {
      shippingName: null,
      address: null,
      roadAddress: null,
      zip: null,
      detailAddress: null,
      recipientName: null,
      recipientMobile: null,
      shippingMessageType: 'BEFORE_CALL',
      defaultAddress: false,
    };
    this.editAddress = {};
    this.addressType = 'R';
    this.defaultAddress = false;
  };

  @action
  saveNewAddress = () => {
    if (!this.newAddress.shippingName) {
      this.root.alert.showAlert('배송지명 을 입력해주세요');
      return false;
    } else if (!this.newAddress.address) {
      this.root.alert.showAlert('주소 를 입력해주세요');
      return false;
    } else if (!this.newAddress.detailAddress) {
      this.root.alert.showAlert('상세주소를 입력해주세요');
      return false;
    } else if (!this.newAddress.recipientName) {
      this.root.alert.showAlert('받는분 의 이름을 입력해주세요');
      return false;
    } else if (!this.newAddress.recipientMobile) {
      this.root.alert.showAlert('받는분 의 연락처를 입력해주세요');
      return false;
    } else if (this.newAddress.recipientMobile) {
      let currentPhoneNum = this.newAddress.recipientMobile;
      let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
      let regTel = /^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])-?\d{3,4}-?\d{4}$/;
      if (currentPhoneNum.length < 9 || currentPhoneNum.length > 11) {
        this.root.alert.showAlert('연락처를 정확히 입력해주세요');
        return false;
      } else if (
        !regPhone.test(currentPhoneNum) &&
        !regTel.test(currentPhoneNum)
      ) {
        this.root.alert.showAlert('연락처를 정확히 입력해주세요');
        return false;
      }
    }

    API.user
      .post(`/users/${this.userId}/shipping-addresses`, this.newAddress)
      .then((res) => {
        this.getAddressList();
        this.addressModalClose();
      })
      .catch((err) => {
        this.root.alert.showAlert({
          content: `${_.get(err, 'data.message') || '오류가 발생했습니다.'}`,
        });
      });
  };

  @action
  setNewAddress = (e, target, address) => {
    let editValue;

    if (e) {
      editValue = e.target.value;
    }
    switch (target) {
      case 'shippingName':
        this.newAddress.shippingName = editValue;
        break;

      case 'recipientName':
        this.newAddress.recipientName = editValue;
        break;

      case 'detailAddress':
        this.newAddress.detailAddress = editValue;
        break;
      case 'recipientMobile':
        let phoneNum = editValue;
        phoneNum = phoneNum.replace(/[^0-9]/g, '');
        this.newAddress.recipientMobile = phoneNum;
        break;
      case 'address':
        this.newAddress.address =
          address.jibunAddress === ''
            ? address.autoJibunAddress
            : address.jibunAddress;
        this.newAddress.zip = address.zonecode;
        this.newAddress.roadAddress =
          address.roadAddress === ''
            ? address.autoRoadAddress
            : address.roadAddress;
        this.addressType = address.userSelectedType;
        break;
      case 'defaultCheck':
        this.newAddress.defaultAddress = e.target.checked;
        this.defaultAddress = e.target.checked;
        break;
      default:
        break;
    }
  };

  // 배송지 수정 Api 호출
  @action
  saveEditAddress = () => {
    if (!this.editAddress.shippingName) {
      this.root.alert.showAlert('배송지명 을 입력해주세요');
      return false;
    } else if (!this.editAddress.address) {
      this.root.alert.showAlert('주소 를 입력해주세요');
      return false;
    } else if (!this.editAddress.detailAddress) {
      this.root.alert.showAlert('상세주소를 입력해주세요.');
      return false;
    } else if (!this.editAddress.recipientName) {
      this.root.alert.showAlert('받는분 의 이름을 입력해주세요.');
      return false;
    } else if (!this.editAddress.recipientMobile) {
      this.root.alert.showAlert('받는분 의 연락처를 입력해주세요.');
      return false;
    } else if (this.editAddress.recipientMobile) {
      let phoneNum = this.editAddress.recipientMobile.replace(/[^0-9]/g, '');
      let currentPhoneNum = phoneNum;
      let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
      let regTel = /^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])-?\d{3,4}-?\d{4}$/;
      if (currentPhoneNum.length < 9 || currentPhoneNum.length > 11) {
        this.root.alert.showAlert('연락처를 정확히 입력해주세요');
        return false;
      } else if (
        !regPhone.test(currentPhoneNum) &&
        !regTel.test(currentPhoneNum)
      ) {
        this.root.alert.showAlert('연락처를 정확히 입력해주세요');
        return false;
      }
    }

    API.user
      .put(
        `/users/${this.userId}/shipping-addresses?shippingAddressId=${this.editAddress.id}`,
        this.editAddress
      )
      .then((res) => {
        this.getAddressList();
        this.addressModalClose();
      });
  };

  @action
  setEditAddress = (e, target, address) => {
    let editValue;

    if (e) {
      editValue = e.target.value;
    }
    switch (target) {
      case 'shippingName':
        this.editAddress.shippingName = editValue;
        break;
      case 'recipientName':
        this.editAddress.recipientName = editValue;
        break;

      case 'detailAddress':
        this.editAddress.detailAddress = editValue;
        break;
      case 'recipientMobile':
        let phoneNum = editValue;
        phoneNum = phoneNum.replace(/[^0-9]/g, '');
        this.editAddress.recipientMobile = phoneNum;
        break;
      case 'address':
        this.editAddress.address =
          address.jibunAddress === ''
            ? address.autoJibunAddress
            : address.jibunAddress;
        this.editAddress.zip = address.zonecode;
        this.editAddress.roadAddress =
          address.roadAddress === ''
            ? address.autoRoadAddress
            : address.roadAddress;
        this.addressType = address.userSelectedType;
        break;

      case 'defaultCheck':
        this.editAddress.defaultAddress = e.target.checked;
        this.defaultAddress = e.target.checked;
        break;

      default:
        break;
    }
  };

  /**
   * 내 기본 배송지
   */
  @computed
  get myDefaultAddress() {
    return this.addressList?.find((address) => address.defaultAddress === true);
  }

  //--------------------- 우편번호 검색 ---------------------
  @action
  searchZipcode = (path) => {
    openDaumAddressSearch({
      onComplete: (data) => {
        switch (path) {
          // 신규
          case 'new':
            this.setNewAddress(null, 'address', data);
            break;

          // 수정
          case 'edit':
            this.setEditAddress(null, 'address', data);
            break;

          // 주문 배송지
          case 'shipping':
            if (data.userSelectedType === 'J') {
              this.setOrderAddress(
                data.jibunAddress === ''
                  ? data.autoJibunAddress
                  : data.jibunAddress,
                'addressBasic'
              ); // 기본주소
              this.setOrderAddress(data.postcode, 'zipcode'); // 기본주소
            } else {
              this.setOrderAddress(
                data.roadAddress === ''
                  ? data.autoRoadAddress
                  : data.roadAddress,
                'roadAddress'
              ); // 도로명 주소
              this.setOrderAddress(data.zonecode, 'zipcode'); // 도로명 주소
            }

            break;

          default:
            break;
        }
      },
    });
  };

  /**
   * 배송지 주소 수정 모달 열기
   */
  @action
  openEditOrderAddressModal = ({ purchaseId, address = {} }) => {
    this.isModalOpen = true;
    this.isOrderAddressModalOpen = true;
    this.orderAddress = { ...address };
    this.orderAddressPurchaseId = purchaseId;
  };

  @action
  closeOrderAddressModal = () => {
    this.isModalOpen = false;
    this.isOrderAddressModalOpen = false;
    this.orderAddress = {};
    this.addressType = 'R';
  };

  /**
   *  주문 배송지 form 수정
   */
  @action
  setOrderAddress = (value, field) => {
    this.orderAddress = Object.assign({}, this.orderAddress, {
      [field]: value,
    });
  };

  /**
   * 주문 배송지 수정 API 호출
   */
  @action
  updateOrderAddress = async () => {
    const orderAddress = toJS(this.orderAddress);

    // 주문에 들어있는 배송지 데이터와, API에 전달할 데이터 필드명에 차이가 있음.
    // (수정할 때는 User API에 있는 배송지 데이터 구조에 맞추고 있기 때문)
    const postData = {
      // defaultAddress: false, // 신규 배송지 여부
      address: orderAddress.addressBasic, // 기본 주소
      detailAddress: orderAddress.addressDetail, // 상세 주소
      recipientMobile: orderAddress.phone, // 연락처
      recipientName: orderAddress.receiverName, // 수신자 이름
      roadAddress: orderAddress.roadAddress, // 도로명 주소
      shippingMessage: orderAddress.message, // 배송 메시지
      shippingMessageType: orderAddress.messageCode, // 배송 메시지 타입
      shippingName: orderAddress.addressname, // 배송지명
      zip: orderAddress.zipcode, // 우편번호
    };

    try {
      await API.order.post(
        `/order/order-update/shipping-address?purchaseId=${this.orderAddressPurchaseId}`,
        postData
      );
      this.root.alert.showAlert('배송지가 변경되었습니다.');
    } catch (err) {
      console.error(err);
      this.root.alert.showAlert({
        content: `${_.get(err, 'data.message') || '오류가 발생했습니다.'}`,
      });
    } finally {
      this.closeOrderAddressModal();
    }
  };
}

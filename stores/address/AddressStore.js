/* eslint-disable no-undef */
import { observable, action } from 'mobx';
import { autoHypenPhone } from '../../utils';
import API from 'lib/API';
import _ from 'lodash';
import Router from 'next/router';
import { devLog } from 'lib/devLog';

const isServer = typeof window === 'undefined';
export default class AddressStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable status = {
    pageStatus: false,
    addressSelf: false,
  };
  @observable userId;
  @observable addressList = {
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

  @action
  getAddress = () => {
    const action = () => {
      this.userId = this.root.user.userInfo.id;

      API.user
        .get(`/users/${this.userId}/shipping-addresses`)
        .then(res => {
          if (res.status === 200) {
            this.addressList.list = res.data.data;
            this.addressList.list = this.addressList.list.map(address => {
              return Object.assign({}, address, {
                recipientMobile: autoHypenPhone(address.recipientMobile),
              });
            });
            devLog(this.addressList.list, 'this.addressList.list');
            this.status.pageStatus = true;
          }
        })
        .catch(err => {
          this.root.alert.showAlert({
            content: err.data.message,
          });
        });
    };

    if (_.isNil(_.get(this.root.user, 'userInfo.id'))) {
      // 유저 정보가 없으면, 유저 정보를 가져온 후 실행할 액션에 추가해준다.
      this.root.user.addFetched(action);
    } else {
      action();
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

  // 배송지 수정
  @action
  addressEditStart = id => {
    this.addressList.currentUseAddressId = id;
    this.addressList.currentEditAddressId = id;

    for (let i = 0; i < this.addressList.list.length; i++) {
      if (this.addressList.list[i].id === id) {
        this.addressList.tempEditAddress = { ...this.addressList.list[i] };
        devLog(this.addressList.tempEditAddress, '123');

        return false;
      }
    }
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
        this.addressList.tempEditAddress.recipientName = editValue;
        break;
      case 'shippingName':
        this.addressList.tempEditAddress.shippingName = editValue;
        break;
      case 'detailAddress':
        this.addressList.tempEditAddress.detailAddress = editValue;
        break;
      case 'recipientMobile':
        this.addressList.tempEditAddress.recipientMobile = editValue;
        break;
      case 'roadAddress':
        this.addressList.tempEditAddress.roadAddress = address.roadAddress;
        this.addressList.tempEditAddress.zip = address.zonecode;
        this.addressList.tempEditAddress.address = address.address;
        break;
      case 'address':
        this.addressList.tempEditAddress.address = address.address;
        this.addressList.tempEditAddress.zip = address.zonecode;
        this.addressList.tempEditAddress.roadAddress = address.roadAddress;
        break;
      default:
        break;
    }
  };

  //--------------------- 배송지 목록 수정 저장(DB) ---------------------
  @action
  addressEditSave = id => {
    this.addressList.currentEditAddressId = 0;
    let targetId = id;
    let data = this.addressList.tempEditAddress;

    API.user
      .put(
        `/users/${
          this.userId
        }/shipping-addresses?shippingAddressId=${targetId}`,
        data
      )
      .then(res => {
        this.addressList.list.map((list, index) => {
          if (list.id === data.id) {
            this.addressList.list[index] = data;
            if (this.addressList.defaultAddress.id === data.id) {
              this.addressList.defaultAddress = data;
            }
          }
        });
        this.root.alert.showAlert({
          content: '배송지 수정완료',
        });
      })
      .catch(res => {
        devLog(res);
        this.root.alert.showAlert({
          content: res.data.message,
        });
      });
  };

  //--------------------- 신규주소 셋팅 ---------------------
  @action
  setNewShippingAddress = (e, target, address) => {
    switch (target) {
      case 'newShippingName':
        this.addressList.newAddress.shippingName = e.target.value;
        break;
      case 'newDetailAddress':
        this.addressList.newAddress.detailAddress = e.target.value;
        break;
      case 'newRecipientName':
        this.addressList.newAddress.recipientName = e.target.value;
        break;
      case 'newRecipientMobile':
        let phoneNum = e.target.value;
        phoneNum = phoneNum.replace(/[^0-9]/g, '');

        this.addressList.newAddress.recipientMobile = phoneNum;
        break;
      case 'roadAddress':
        this.addressList.newAddress.roadAddress = address.roadAddress;
        this.addressList.newAddress.zip = address.zonecode;
        this.addressList.newAddress.address = address.address;
        break;
      case 'address':
        this.addressList.newAddress.address = address.address;
        this.addressList.newAddress.zip = address.zonecode;
        this.addressList.newAddress.roadAddress = address.roadAddress;
        break;
      default:
        break;
    }
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
        `/users/${this.userId}/shipping-addresses?shippingAddressId=${targetId}`
      )
      .then(res => {
        this.root.alert.showAlert({
          content: '배송지 삭제완료.',
        });
        this.addressList.list.map((data, index) => {
          if (data.id === targetId) {
            this.addressList.list.splice(index, 1);
          }
          if (this.addressList.list.length > 0) {
            this.addressList.currentUseAddressId = this.addressList.list[0].id;
            this.addressList.defaultAddress = this.addressList.list[0];
          } else {
            this.status.shppingListModalStatus = !this.status
              .shppingListModalStatus;
            this.status.selectedShipStatus = false;
            this.addressList.currentUseAddressId = 0;
            this.addressList.defaultAddress = null;
          }
        });
      })
      .catch(err => {
        devLog(err);
        this.root.alert.showAlert({
          content: res.data.message,
        });
      });
  };
  //--------------------- 배송지 목록 수정 취소(Local) ---------------------
  @action
  addressEditCancel = () => {
    this.addressList.currentEditAddressId = 0;
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
                addressEditing(null, 'address', data);
                document.getElementById('edit__zipCode').value = data.zonecode;
                document.getElementById('edit__address').value =
                  data.jibunAddress;
              } else {
                addressEditing(null, 'roadAddress', data);
                document.getElementById('edit__zipCode').value = data.zonecode;
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

  @action
  newAddressCheckbox = (e, option) => {
    let bool = e.target.checked;
    if (option === 'default') {
      this.addressList.newAddress.defaultAddress = bool;
    } else {
      this.addressList.isAddShippingAddress = bool;
    }
  };

  @action
  newAddressCheckbox = (e, option) => {
    let bool = e.target.checked;
    if (option === 'default') {
      this.addressList.newAddress.defaultAddress = bool;
    } else {
      this.addressList.isAddShippingAddress = bool;
    }
  };

  @action
  selfAddressConfirm = () => {
    if (!this.addressList.newAddress.shippingName) {
      this.root.alert.showAlert({
        content: '배송지이름을 입력해주세요.',
      });
      this.status.newShippingName = true;
      return false;
    } else if (!this.addressList.newAddress.address) {
      this.root.alert.showAlert({
        content: '주소를 입력해주세요.',
      });
      this.status.newAddress = true;
      return false;
    } else if (!this.addressList.newAddress.detailAddress) {
      this.root.alert.showAlert({
        content: '상세주소를 입력해주세요.',
      });
      this.status.newDetail = true;
      return false;
    } else if (!this.addressList.newAddress.recipientName) {
      this.root.alert.showAlert({
        content: '받는분 을 입력해주세요.',
      });
      this.status.newRecipientName = true;
      return false;
    } else if (!this.addressList.newAddress.recipientMobile) {
      this.root.alert.showAlert({
        content: '연락처를 입력해주세요.',
      });
      this.status.newRecipientMobile = true;
      return false;
    } else if (this.addressList.newAddress.recipientMobile) {
      let currentPhoneNum = this.addressList.newAddress.recipientMobile;
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
    }

    let forms = {
      shippingAddress: this.addressList.newAddress,
    };

    sessionStorage.setItem('paymentInfo', JSON.stringify(forms));
    Router.push('/');
  };
}

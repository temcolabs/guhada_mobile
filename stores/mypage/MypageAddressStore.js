import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
const isServer = typeof window === 'undefined';
import { isBrowser } from 'lib/isServer';
import { autoHypenPhone } from '../../utils';
import { devLog } from 'lib/devLog';

export default class MypageAddressStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable addressList = [];
  @observable newAddress = {
    shippingName: null,
    address: null,
    roadAddress: null,
    zip: null,
    detailAddress: null,
    recepientName: null,
    recepientMobile: null,
    shippingMessageType: 'BEFORE_CALL',
    defaultAddress: false,
  };
  @observable editAddress = {};
  @observable currentCheckedId;
  @observable userInfo = JSON.parse(localStorage.getItem('guhada-userinfo'));
  @observable userId;
  @observable mypageAddressModal = false;

  @action
  getAddressList = () => {
    let userInfo = JSON.parse(this.userInfo.value);
    this.userId = userInfo.id;
    API.user.get(`/users/${this.userId}/shipping-addresses`).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.addressList = data.data;

        this.addressList.map(data => {
          data.recepientMobile = autoHypenPhone(data.recepientMobile);
          if (data.defaultAddress) {
            this.currentCheckedId = data.id;
          }
        });

        devLog(this.addressList, '배송지목록');
      }
    });
  };

  @action
  changeAddress = id => {
    this.addressList.map(data => {
      if (data.id === id) {
        this.currentCheckedId = data.id;
      }
    });
  };

  @action
  editAddressModal = id => {
    this.addressList.map(data => {
      if (data.id === id) {
        this.editAddress = { ...data };
      }
    });
    this.mypageAddressModal = true;
  };

  @action
  deleteAddress = id => {
    let targetId = id;

    API.user
      .delete(
        `/users/${this.userId}/shipping-addresses?shippingAddressId=${targetId}`
      )
      .then(res => {
        if (res.data.resultCode === 200) {
          this.root.alert.showAlert({
            content: '배송지 삭제완료',
          });
          this.addressList.map((data, index) => {
            if (data.id == targetId) {
              this.addressList.splice(index, 1);
            }
          });
        }
      });
  };

  @action
  newAddressModal = () => {
    this.editAddress = {};
    this.mypageAddressModal = true;
    devLog(this.mypageAddressModal);
  };

  @action
  addressModalClose = () => {
    this.newAddress = {
      shippingName: null,
      address: null,
      roadAddress: null,
      zip: null,
      detailAddress: null,
      recepientName: null,
      recepientMobile: null,
      shippingMessageType: 'BEFORE_CALL',
      defaultAddress: false,
    };
    this.mypageAddressModal = false;
  };

  @action
  saveNewAddress = () => {
    if (!this.newAddress.shippingName) {
      this.root.alert.showAlert({
        content: '배송지명 을 입력해주세요',
      });
      return false;
    } else if (!this.newAddress.address) {
      this.root.alert.showAlert({
        content: '주소 를 입력해주세요',
      });
      return false;
    } else if (!this.newAddress.detailAddress) {
      this.root.alert.showAlert({
        content: '상세주소를 입력해주세요',
      });
      return false;
    } else if (!this.newAddress.recepientName) {
      this.root.alert.showAlert({
        content: '받는분 의 이름을 입력해주세요',
      });
      return false;
    } else if (!this.newAddress.recepientMobile) {
      this.root.alert.showAlert({
        content: '받는분 의 연락처를 입력해주세요',
      });
      return false;
    } else if (this.newAddress.recepientMobile) {
      let currentPhoneNum = this.newAddress.recepientMobile;
      let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
      if (currentPhoneNum.length < 10 || currentPhoneNum.length > 11) {
        this.root.alert.showAlert({
          content: '휴대폰번호는 10자리 이상 11자리 이하입니다',
        });
        return false;
      } else if (!regPhone.test(currentPhoneNum)) {
        this.root.alert.showAlert({
          content: '휴대폰번호 를 정확히 입력해주세요',
        });
        return false;
      }
    }
    devLog(this.userId, this.newAddress, 'test');
    API.user
      .post(`/users/${this.userId}/shipping-addresses`, this.newAddress)
      .then(res => {
        devLog(res, '배송지저장성공');
        if (res.data.resultCode === 200) {
          this.root.alert.showAlert({
            content: '신규배송지 저장',
          });
        }
        this.getAddressList();
        this.mypageAddressModal = false;
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
      case 'recepientName':
        this.newAddress.recepientName = editValue;
        break;

      case 'detailAddress':
        this.newAddress.detailAddress = editValue;
        break;
      case 'recepientMobile':
        let phoneNum = editValue;
        phoneNum = phoneNum.replace(/[^0-9]/g, '');
        this.newAddress.recepientMobile = phoneNum;
        break;
      case 'roadAddress':
        this.newAddress.roadAddress = address.roadAddress;
        this.newAddress.zip = address.zonecode;
        this.newAddress.address = address.address;
        break;
      case 'address':
        this.newAddress.address = address.address;
        this.newAddress.zip = address.zonecode;
        this.newAddress.roadAddress = address.roadAddress;
        break;
      case 'defaultCheck':
        this.newAddress.defaultAddress = e.target.checked;
        break;
      default:
        break;
    }
  };

  // 배송지 수정 Api 호출
  @action
  saveEditAddress = () => {
    if (!this.editAddress.shippingName) {
      this.root.alert.showAlert({
        content: '배송지명 을 입력해주세요',
      });
      return false;
    } else if (!this.editAddress.address) {
      this.root.alert.showAlert({
        content: '주소 를 입력해주세요',
      });
      return false;
    } else if (!this.editAddress.detailAddress) {
      this.root.alert.showAlert({
        content: '상세주소를 입력해주세요.',
      });
      return false;
    } else if (!this.editAddress.recepientName) {
      this.root.alert.showAlert({
        content: '받는분 의 이름을 입력해주세요.',
      });
      return false;
    } else if (!this.editAddress.recepientMobile) {
      this.root.alert.showAlert({
        content: '받는분 의 연락처를 입력해주세요.',
      });
      return false;
    } else if (this.editAddress.recepientMobile) {
      let phoneNum = this.editAddress.recepientMobile.replace(/[^0-9]/g, '');
      let currentPhoneNum = phoneNum;
      let regPhone = /^((01[1|6|7|8|9])[0-9][0-9]{6,7})|(010[0-9][0-9]{7})$/;
      devLog(
        this.editAddress.recepientMobile,
        currentPhoneNum,
        'currentPhoneNum eidt'
      );
      if (currentPhoneNum.length < 10 || currentPhoneNum.length > 11) {
        this.root.alert.showAlert({
          content: '휴대폰번호는 10자리 이상 11자리 이하입니다',
        });
        return false;
      } else if (!regPhone.test(currentPhoneNum)) {
        this.root.alert.showAlert({
          content: '휴대폰번호 를 정확히 입력해주세요',
        });
        return false;
      }
    }

    API.user
      .put(
        `/users/${this.userId}/shipping-addresses?shippingAddressId=${
          this.editAddress.id
        }`,
        this.editAddress
      )
      .then(res => {
        if (res.data.resultCode === 200) {
          this.addressList.map((data, index) => {
            if (data.id === this.editAddress.id) {
              this.addressList[index] = this.editAddress;
            }
          });
          this.root.alert.showAlert({
            content: '배송지를 수정하였습니다.',
          });
          this.mypageAddressModal = false;
        }
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
      case 'recepientName':
        this.editAddress.recepientName = editValue;
        break;

      case 'detailAddress':
        this.editAddress.detailAddress = editValue;
        break;
      case 'recepientMobile':
        let phoneNum = editValue;
        phoneNum = phoneNum.replace(/[^0-9]/g, '');
        this.editAddress.recepientMobile = phoneNum;
        break;
      case 'roadAddress':
        this.editAddress.roadAddress = address.roadAddress;
        this.editAddress.zip = address.zonecode;
        this.editAddress.address = address.address;
        break;
      case 'address':
        this.editAddress.address = address.address;
        this.editAddress.zip = address.zonecode;
        this.editAddress.roadAddress = address.roadAddress;
        break;
      case 'defaultCheck':
        this.editAddress.defaultAddress = e.target.checked;
        break;
    }
  };

  @action
  setDefaultAddress = () => {
    if (!this.currentCheckedId) {
      this.root.alert.showAlert({
        content: '선택된 배송지가 없습니다',
      });
      return false;
    }
    this.addressList.map(data => {
      if (data.id == this.currentCheckedId) {
        this.editAddress = { ...data };
        this.editAddress.defaultAddress = true;
      }
    });

    API.user
      .put(
        `/users/${this.userId}/shipping-addresses?shippingAddressId=${
          this.editAddress.id
        }`,
        this.editAddress
      )
      .then(res => {
        if (res.data.resultCode === 200) {
          this.getAddressList();
          this.root.alert.showAlert({
            content: '기본배송지 설정 완료',
          });
          this.getAddressList();
          this.editAddress = {};
          this.mypageAddressModal = false;
        }
      });
  };
  //--------------------- 우편번호 검색 ---------------------
  @action
  searchZipcode = (path, setEditAddress, setNewAddress) => {
    daum.postcode.load(function() {
      new daum.Postcode({
        oncomplete: function(data) {
          switch (path) {
            case 'new':
              if (data.userSelectedType === 'J') {
                devLog(data, '우편데이터');
                document.getElementById('mypage__newAddress').value = `(우:${
                  data.zonecode
                }) ${data.jibunAddress}`;
                setNewAddress(null, 'address', data);
              } else {
                document.getElementById('mypage__newAddress').value = `(우:${
                  data.zonecode
                }) ${data.roadAddress}`;
                setNewAddress(null, 'roadAddress', data);
              }
              break;
            case 'edit':
              if (data.userSelectedType === 'J') {
                setEditAddress(null, 'address', data);
                document.getElementById('mypage__editAddress').value =
                  data.jibunAddress;
              } else {
                setEditAddress(null, 'roadAddress', data);
                document.getElementById('mypage__editAddress').value =
                  data.roadAddress;
              }
              break;
          }
        },
      }).open();
    });
  };
}

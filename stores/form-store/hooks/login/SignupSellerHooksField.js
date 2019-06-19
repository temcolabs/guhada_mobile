import Axios from 'axios';
import Router from 'next/router';
import Form from '../../_.forms';
import { autoHypenPhone, autoHypenTele } from '../../../../utils';
import customOption from '../../setup/customOption';
import { loadScript } from 'lib/dom';
import API from 'lib/API';

function handlePostCode(path) {
  let form = Form.signUpSeller;

  if (!document.getElementById('daumPostcode')) {
    loadScript(
      'http://dmaps.daum.net/map_js_init/postcode.v2.js?autoload=false',
      () => {
        window.daum.postcode.load(function() {
          new window.daum.Postcode({
            oncomplete: function(data) {
              console.log(data);

              // 리턴 받은 값을 선택한 정보에 따라서 View에 뿌려주는 if else

              if (path === 'addressView') {
                form.$('address').set(data.jibunAddress);
                form.$('roadAddress').set(data.roadAddress);
                form.$('zip').set(data.sigunguCode);
                form.$('managerSameAsUser').set(false);
              } else if (path === 'departureAddressView') {
                form.$('departureAddress').set(data.jibunAddress);
                form.$('departureRoadAddress').set(data.roadAddress);
                form.$('departureZip').set(data.sigunguCode);
                form.$('originSameAsUser').set(false);
              } else if (path === 'returnAddressView') {
                form.$('returnAddress').set(data.jibunAddress);
                form.$('returnRoadAddress').set(data.roadAddress);
                form.$('returnZip').set(data.sigunguCode);
                form.$('returnSameAsUser').set(false);
              }

              let buildingName = '';
              if (data.buildingName) {
                buildingName = ' (' + data.buildingName + ')';
              }

              if (data.userSelectedType === 'R') {
                if (path === 'addressView') {
                  form.$(path).set(data.roadAddress + buildingName);
                } else if (path === 'departureAddressView') {
                  form.$(path).set(data.roadAddress + buildingName);
                } else if (path === 'returnAddressView') {
                  form.$(path).set(data.roadAddress + buildingName);
                }
              } else if (data.userSelectedType === 'J') {
                if (path === 'addressView') {
                  form.$(path).set(data.jibunAddress);
                } else if (path === 'departureAddressView') {
                  form.$(path).set(data.jibunAddress);
                } else if (path === 'returnAddressView') {
                  form.$(path).set(data.jibunAddress);
                }
              }
            },
          }).open();
        });
      }
    );
  } else if (document.getElementById('daumPostcode')) {
    window.daum.postcode.load(function() {
      new window.daum.Postcode({
        oncomplete: function(data) {
          console.log(data);

          // 리턴 받은 값을 선택한 정보에 따라서 View에 뿌려주는 if else

          if (path === 'addressView') {
            form.$('address').set(data.jibunAddress);
            form.$('roadAddress').set(data.roadAddress);
            form.$('zip').set(data.sigunguCode);
            form.$('managerSameAsUser').set(false);
          } else if (path === 'departureAddressView') {
            form.$('departureAddress').set(data.jibunAddress);
            form.$('departureRoadAddress').set(data.roadAddress);
            form.$('departureZip').set(data.sigunguCode);
            form.$('originSameAsUser').set(false);
          } else if (path === 'returnAddressView') {
            form.$('returnAddress').set(data.jibunAddress);
            form.$('returnRoadAddress').set(data.roadAddress);
            form.$('returnZip').set(data.sigunguCode);
            form.$('returnSameAsUser').set(false);
          }

          let buildingName = '';
          if (data.buildingName) {
            buildingName = ' (' + data.buildingName + ')';
          }

          if (data.userSelectedType === 'R') {
            if (path === 'addressView') {
              form.$(path).set(data.roadAddress + buildingName);
            } else if (path === 'departureAddressView') {
              form.$(path).set(data.roadAddress + buildingName);
            } else if (path === 'returnAddressView') {
              form.$(path).set(data.roadAddress + buildingName);
            }
          } else if (data.userSelectedType === 'J') {
            if (path === 'addressView') {
              form.$(path).set(data.jibunAddress);
            } else if (path === 'departureAddressView') {
              form.$(path).set(data.jibunAddress);
            } else if (path === 'returnAddressView') {
              form.$(path).set(data.jibunAddress);
            }
          }
        },
      }).open();
    });
  }
}

function callSubmit(form, field) {
  if (field.path === 'storeName') {
    API.user.get('/storeNameUsable/' + field.value).then(function(res) {
      console.log(res);
      let data = res.data;
      if (data.resultCode === 200) {
        form.$('storeButton').set('label', '사용 가능');
        form.$('storeButton').set('value', true);
        form.$('storeConfirm').set('value', true);
      } else {
        form.$('storeButton').set('label', '중복 확인');
        form.$('storeButton').set('value', false);
        form.$('storeName').invalidate(data.data.result);
        form.$('storeConfirm').set('value', false);
      }
    });
  } else if (field.path === 'mobile') {
    API.user.get('/verify/getVerifyingIdentityUrl').then(function(res) {
      console.log(res.data);
      let data = res.data;

      if (data.resultCode === 200) {
        API.user
          .post('/verify/sendMobile', {
            mobile: field.value.replace(/-/gi, ''),
          })
          .then(function(res) {
            console.log(res.data);
            let data = res.data;

            if (data.resultCode === 200) {
              form.$('authMobile').set('label', '인증번호');
              form.$('authMobileCountdown').set('value', '1000');
            } else {
              form.$('authMobile').set('label', '인증');
              form.$('mobile').invalidate(data.data.result);
            }
          });
      } else {
        form.$('mobile').invalidate(data.data.result);
      }
    });
  } else if (field.path === 'authMobile') {
    API.user
      .post('/verify', {
        verificationNumber: field.value,
        verificationTarget: form.$('mobile').value,
        verificationTargetType: 'MOBILE',
      })
      .then(function(res) {
        console.log(res.data);
        let data = res.data;

        if (data.resultCode === 200) {
          form.$('authMobileButton').set('label', '인증 완료');
          form.$('authMobileButton').set('value', true);
          form.$('authMobileConfirm').set('value', true);
          form.$('authMobileCountdown').set('value', '');
        } else {
          form.$('authMobileButton').set('label', '인증');
          form.$('authMobile').invalidate(data.data.result);
          form.$('authMobileButton').set('value', false);
        }
      });
  } else if (field.path === 'claimTelephone') {
    field.set('value', form.$('mobile').value);
  } else if (field.path === 'accountHolder') {
    API.user
      .post('/verify/checkAccount', {
        accountHolder: form.$('accountHolder').value,
        accountNumber: form.$('accountNumber').value,
        bankCode: form.$('bankCode').value.value,
      })
      .then(function(res) {
        console.log(res.data);
        let data = res.data;

        if (data.resultCode === 200) {
          form.$('accountHolderButton').set('label', '확인 완료');
          form.$('accountHolderButton').set('value', true);
          form.$('accountConfirm').set('value', true);
        } else {
          form.$('accountHolderButton').set('label', '계좌 확인');
          form.$('accountHolderButton').set('value', false);
          form.$('accountHolderButton').invalidate(data.data.result);
          form.$('accountConfirm').set('value', false);
        }
      });
  } else if (field.path === 'email' && field.value) {
    API.user.get('/isEmailExist/' + field.value).then(function(res) {
      console.log(res);
      let data = res.data;
      if (data.resultCode === 200) {
        form.$('emailButton').set('label', '사용 가능');
        form.$('emailButton').set('value', true);
        form.$('emailConfirm').set('value', true);
      } else {
        form.$('emailButton').set('label', '중복 확인');
        form.$('emailButton').set('value', false);
        form.$('email').invalidate(data.data.result);
        form.$('emailConfirm').set('value', false);
      }
    });
  }
}
export default {
  onInit() {},

  onSuccess(field) {
    let form = Form.signUpSeller;
    console.log(field);
    console.log('-> onSubmit HOOK -', field.path, field.value);
    let addressFieldCheck = 0;

    if (
      field.path === 'addressView' ||
      field.path === 'departureAddressView' ||
      field.path === 'returnAddressView'
    )
      addressFieldCheck = 1;

    console.log(addressFieldCheck);
    if (addressFieldCheck === 1) {
      handlePostCode(field.path);
      return;
    }

    callSubmit(form, field);
  },

  onError(field) {
    console.log('field Values', field.values());
    console.log('field Errors', field.errors());
    let form = Form.signUpSeller;

    if (field.path === 'claimTelephone') {
      let managerMobile = form.$('managerMobile');
      let mobile = form.$('mobile');

      if (managerMobile.value) {
        field.set('value', managerMobile.value);
      } else if (mobile.value) {
        field.set('value', mobile.value);
      }
    }
  },

  onFocus() {
    console.log('onFocus');
  },

  onToggle() {
    console.log('onToggle');
  },

  onSubmit(instance) {
    console.log(
      '-> onSubmit HOOK -',
      instance.path || 'form',
      '- isValid?',
      instance.isValid
    );
  },

  onClear(instance) {
    console.log('-> onClear HOOK -', instance.path || 'form');
  },

  onReset(instance) {
    console.log('-> onReset HOOK -', instance.path || 'form');
  },

  onChange(field) {
    console.log('-> onChange HOOK -', field.path, field.value);

    let form = Form.signUpSeller;
    let data = form.values();

    if (field.path === 'claimTelephoneButton') {
      if (field.value) {
        form.$('claimTelephone').set(data.mobile);
      } else {
        form.$('claimTelephone').set('');
      }
    }

    // 데이터 입력시 정보 동일 체크박스 false
    if (
      field.path === 'managerName' ||
      field.path === 'managerEmail' ||
      field.path === 'managerMobile'
    ) {
      form.$('managerSameAsUser').set(false);
    } else if (
      field.path === 'departureName' ||
      field.path === 'departureTelephone' ||
      field.path === 'departureAddressView' ||
      field.path === 'departureDetailAddress'
    ) {
      form.$('originSameAsUser').set(false);
    } else if (
      field.path === 'returnName' ||
      field.path === 'returnTelephone' ||
      field.path === 'returnAddressView' ||
      field.path === 'returnDetailAddress'
    ) {
      form.$('returnSameAsUser').set(false);
    }

    if (field.path === 'managerSameAsUser' && field.value === true) {
      form.$('managerName').set(data.name);
      form.$('managerEmail').set(data.email);
      form.$('managerMobile').set(data.mobile);

      form.$('managerEmail').validate();
      form.$('managerName').validate();
      form.$('managerMobile').validate();
    } else if (field.path === 'originSameAsUser' && field.value === true) {
      if (form.$('departureName').value === '') {
        form.$('departureName').set('출고지');
        form.$('departureName').validate();
      }
      // 전화번호 불러오는 로직
      if (data.managerMobile) {
        form.$('departureTelephone').set(data.managerMobile);
        form.$('departureTelephone').validate();
      } else if (data.mobile) {
        form.$('departureTelephone').set(data.mobile);
        form.$('departureTelephone').validate();
      }
      form.$('departureAddressView').set(data.addressView);
      form.$('departureAddress').set(data.address);
      form.$('departureRoadAddress').set(data.roadAddress);
      form.$('departureZip').set(data.zip);
      form.$('departureDetailAddress').set(data.detailAddress);

      form.$('departureAddressView').validate();
      form.$('departureAddress').validate();
      form.$('departureRoadAddress').validate();
      form.$('departureZip').validate();
      form.$('departureDetailAddress').validate();
    } else if (field.path === 'returnSameAsUser' && field.value === true) {
      if (form.$('returnName').value === '') {
        form.$('returnName').set('반품지');
        form.$('returnName').validate();
      }
      // 전화번호 불러오는 로직
      if (data.managerMobile) {
        form.$('returnTelephone').set(data.managerMobile);
        form.$('returnTelephone').validate();
      } else if (data.mobile) {
        form.$('returnTelephone').set(data.mobile);
        form.$('returnTelephone').validate();
      }
      form.$('returnAddressView').set(data.addressView);
      form.$('returnAddress').set(data.address);
      form.$('returnRoadAddress').set(data.roadAddress);
      form.$('returnZip').set(data.zip);
      form.$('returnDetailAddress').set(data.detailAddress);

      form.$('returnAddressView').validate();
      form.$('returnAddress').validate();
      form.$('returnRoadAddress').validate();
      form.$('returnZip').validate();
      form.$('returnDetailAddress').validate();
    }

    // type tel 인 input - 추가
    if (field.get('type') === 'tel') {
      console.log(field.path);
      if (field.path === 'managerTelephone' || field.path === 'fax') {
        field.set(autoHypenTele(field.value));
        console.log('in');
      } else {
        console.log('out');
        field.set(autoHypenPhone(field.value));
      }
    }

    // 가입 시 확인해야 할 부분이 변경되어 있을 때 confirm 값 false 처리

    if (field.path === 'email') {
      form.$('emailButton').set('label', '중복 확인');
      form.$('emailConfirm').set('value', false);
    } else if (field.path === 'mobile') {
      form.$('authMobileButton').set('label', '인증');
      form.$('authMobileConfirm').set('value', false);
    } else if (
      field.path === 'bankCode' ||
      field.path === 'accountNumber' ||
      field.path === 'accountHolder'
    ) {
      form.$('accountHolderButton').set('label', '계좌 확인');
      form.$('accountConfirm').set('value', false);
    } else if (field.path === 'storeName') {
      form.$('storeButton').set('label', '중복 확인');
      form.$('storeConfirm').set('value', false);
    }
  },

  onBlur: field => {
    console.log('-> onBlur HOOK -', field.path, field.value);
    // let form = Form.signUpSeller;
    // callSubmit(form, field);
    // field.validate({ showErrors: true });

    if (field.path === 'storeName') {
      let reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9||.||_|\*]+$/;
      if (!reg.test(field.value)) {
        console.log('false');
        field.invalidate(
          '닉네임은 영문, 한글, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.'
        );
        return;
      }
    }
    // 모바일 번호 입력시
    // 숫자만 입력받도록 처리
    if (field.path === 'mobileNumber') {
      let checkMobileNumber = field.value;

      checkMobileNumber = checkMobileNumber.replace(/[^0-9]/g, '');
      field.set(checkMobileNumber);
    }
  },
};

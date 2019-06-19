import Axios from 'axios';
import Router from 'next/router';
import Form from '../../_.forms';
import { autoHypenPhone, autoHypenTele } from '../../../../utils';
import API from 'lib/API';

export default {
  onInit() {
    // override default bindings for all text inputs
    this.name === 'Register Material' &&
      this.each(
        field =>
          field.type === 'text' && field.set('bindings', 'MaterialTextField')
      );
  },

  onSuccess(form) {
    console.log(form);
    console.log('-> onSubmit HOOK -', form.path, form.value);

    let termData = Form.termSeller.values();

    if (!form.$('addressView').value) {
      form
        .$('addressView')
        .invalidate('주소(우편번호)은(는) 필수 정보 입니다.');
    }
    if (!form.$('departureAddressView').value) {
      form
        .$('departureAddressView')
        .invalidate('출고지 주소 (우편번호)은(는) 필수 정보 입니다.');
    }

    if (!form.$('returnAddressView').value) {
      form
        .$('returnAddressView')
        .invalidate('반품/교환지 주소(우편번호)은(는) 필수 정보 입니다.');
    }

    let emailConfirm = form.$('emailConfirm').value;
    let authMobileConfirm = form.$('authMobileConfirm').value;
    let accountConfirm = form.$('accountConfirm').value;
    let storeConfirm = form.$('storeConfirm').value;

    if (!emailConfirm) {
      form.$('email').invalidate('아이디(이메일) 중복 확인을 하셔야 합니다.');
    }

    // if (!authMobileConfirm) {
    //   form.$('mobile').invalidate('전화번호 인증을 하셔야 합니다.');
    // }

    if (!accountConfirm) {
      form.$('accountHolder').invalidate('계좌 확인을 하셔야 합니다.');
    }

    if (!storeConfirm) {
      form
        .$('storeName')
        .invalidate('스토어 닉네임 중복 확인을 하셔야 합니다.');
    }

    if (window.document.getElementsByClassName('input-error')[0]) {
      let errorPositionY = window.document.getElementsByClassName(
        'input-error'
      )[0].offsetTop;
      window.scrollTo(0, errorPositionY);
    }

    if (
      !emailConfirm ||
      // !authMobileConfirm ||
      !accountConfirm ||
      !storeConfirm
    ) {
      return;
    }

    let data = form.values();

    let formData = new FormData();

    formData.append('accountHolder', data.accountHolder);
    formData.append('accountNumber', data.accountNumber);
    formData.append('address', data.address);
    formData.append('bankCode', data.bankCode.value);
    formData.append(
      'birth',
      data.birthYear.value +
        '-' +
        data.birthMonth.value +
        '-' +
        data.birthDay.value
    );
    formData.append(
      'calculationReceivingMethod',
      data.calculationReceivingMethod
    );
    formData.append('claimTelephone', data.claimTelephone.replace(/-/gi, ''));
    formData.append('departureAddress', data.departureAddress);
    formData.append('departureDetailAddress', data.departureDetailAddress);
    formData.append('departureName ', data.departureName);
    formData.append('departureRoadAddress', data.departureRoadAddress);
    formData.append(
      'departureTelephone',
      data.departureTelephone.replace(/-/gi, '')
    );
    formData.append('departureZip', data.departureZip);
    formData.append('detailAddress', data.detailAddress);
    formData.append('email', data.email);
    formData.append('fax', data.fax.replace(/-/gi, ''));
    formData.append('gender', data.gender);
    formData.append('managerEmail', data.managerEmail);
    formData.append('managerMobile', data.managerMobile.replace(/-/gi, ''));
    formData.append('managerName', data.managerName);
    formData.append(
      'managerTelephone',
      data.managerTelephone.replace(/-/gi, '')
    );
    formData.append('mobile', data.mobile.replace(/-/gi, ''));
    formData.append('name', data.name);
    formData.append('password', data.password);
    formData.append('returnAddress', data.returnAddress);
    formData.append('returnDetailAddress', data.returnDetailAddress);
    formData.append('returnName ', data.returnName);
    formData.append('returnRoadAddress', data.returnRoadAddress);
    formData.append('returnTelephone', data.returnTelephone.replace(/-/gi, ''));
    formData.append('returnZip', data.returnZip);
    formData.append('roadAddress', data.roadAddress);
    formData.append('storeIntroduction', data.storeIntroduction);
    formData.append('storeName', data.storeName);
    formData.append('zip', data.zip);
    if (data.profilePhoto) formData.append('profilePhoto', data.profilePhoto);

    formData.append(
      'agreeCollectPersonalInfoTos',
      termData.agreeCollectPersonalInfoTos
    );
    formData.append('agreeEmailReception', termData.agreeEmailReception);
    formData.append('agreePurchaseTos', termData.agreePurchaseTos);
    formData.append('agreeSaleTos', termData.agreeSaleTos);
    formData.append('agreeSmsReception', termData.agreeSmsReception);

    API.user.post('/signUpSellerUser', { formData }).then(function(res) {
      console.log(res.data);
      let data = res.data;

      if (data.resultCode === 200) {
        Router.push('/?signupsuccess=true&email=' + data.email);
      } else {
        form.$('email').invalidate(data.data.result);
      }
    });
  },

  onError(form) {
    console.log('Form Values', form.values());
    console.log('Form Errors', form.errors());

    let globalForm = Form.signUpSeller;

    if (form.errors().storeName) {
      form
        .$('storeName')
        .invalidate(
          '닉네임은 영문, 한글, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.'
        );
    }

    // 에러난 클래스의 position Y 값을 구해서 scroll을 옮겨주는 기능
    if (window.document.getElementsByClassName('input-error')[0]) {
      let errorPositionY = window.document.getElementsByClassName(
        'input-error'
      )[0].offsetTop;
      window.scrollTo(0, errorPositionY);
    }
    if (!form.$('addressView').value) {
      form
        .$('addressView')
        .invalidate('주소(우편번호)은(는) 필수 정보 입니다.');
    }
    if (!form.$('departureAddressView').value) {
      form
        .$('departureAddressView')
        .invalidate('출고지 주소 (우편번호)은(는) 필수 정보 입니다.');
    }

    if (!form.$('returnAddressView').value) {
      form
        .$('returnAddressView')
        .invalidate('반품/교환지 주소(우편번호)은(는) 필수 정보 입니다.');
    }
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

    if (field.path === 'managerSameAsUser' && field.value === true) {
      form.$('managerName').set(data.name);
      form.$('managerEmail').set(data.email);
      form.$('managerMobile').set(data.mobile);

      form.$('managerEmail').validate();
      form.$('managerName').validate();
      form.$('managerMobile').validate();
    } else if (field.path === 'originSameAsUser' && field.value === true) {
      form.$('originName').set('출고지');
      // 전화번호 불러오는 로직
      if (data.managerMobile) {
        form.$('departureTelephone').set(data.managerMobile);
        form.$('departureTelephone').validate();
      } else if (data.sellerMobile) {
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
      form.$('returnName').set('반품지');
      // 전화번호 불러오는 로직
      if (data.managerMobile) {
        form.$('returnTelephone').set(data.managerMobile);
        form.$('returnTelephone').validate();
      } else if (data.sellerMobile) {
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
  },

  onBlur: field => {
    console.log('-> onBlur HOOK -', field.path, field.value);

    field.validate({ showErrors: true });

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

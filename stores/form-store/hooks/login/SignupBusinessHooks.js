import Axios from 'axios';
import Router from 'next/router';
import Form from '../../_.forms';
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

    let notReportingType = form.$('notReportingType');
    let mailorderBusiness = form.$('mailorderBusiness');
    let mailorderRegistrationNumber = form.$('mailorderRegistrationNumber');

    // 통신판매업 신고 validation
    if (mailorderBusiness.value === 'true') {
      notReportingType.set('value', '');
      if (!mailorderRegistrationNumber.value) {
        mailorderRegistrationNumber.invalidate(
          '통신 판매업 신고 번호를 입력하셔야 합니다.'
        );
        return;
      }
    } else {
      mailorderRegistrationNumber.set('value', '');
      if (!notReportingType.value) {
        notReportingType.invalidate('미신고 사유를 입력하셔야 합니다.');
        return;
      }
    }

    let emailConfirm = form.$('emailConfirm').value;
    let authMobileConfirm = form.$('authMobileConfirm').value;
    let accountConfirm = form.$('accountConfirm').value;
    let storeConfirm = form.$('storeConfirm').value;

    if (!emailConfirm) {
      form.$('email').invalidate('아이디(이메일) 중복 확인을 하셔야 합니다.');
    }

    if (!authMobileConfirm) {
      form.$('mobile').invalidate('전화번호 인증을 하셔야 합니다.');
    }

    if (!accountConfirm) {
      form.$('accountHolder').invalidate('계좌 확인을 하셔야 합니다.');
    }

    if (!storeConfirm) {
      form
        .$('storeName')
        .invalidate('스토어 닉네임 중복 확인을 하셔야 합니다.');
    }

    let businessDivision = form.$('businessDivision').value;
    let corporationRegistrationNumber = form.$('corporationRegistrationNumber')
      .value;

    // 법인 사업자일 때 법인 등록번호 확인
    if (businessDivision.value === 'CORPORATION') {
      if (!corporationRegistrationNumber) {
        form
          .$('corporationRegistrationNumber')
          .invalidate('법인 등록번호는 필수 정보입니다.');
      }
    } else {
      form.$('corporationRegistrationNumber').set('value', '');
    }

    if (window.document.getElementsByClassName('input-error')[0]) {
      let errorPositionY = window.document.getElementsByClassName(
        'input-error'
      )[0].offsetTop;
      window.scrollTo(0, errorPositionY);
    }

    if (mailorderBusiness.value === 'true') {
      if (!mailorderRegistrationNumber.value) {
        console.log(mailorderRegistrationNumber.value);
        return;
      }
    } else {
      if (!notReportingType.value) {
        console.log(notReportingType.value);
        return;
      }
    }

    if (
      !emailConfirm ||
      !authMobileConfirm ||
      !accountConfirm ||
      !storeConfirm
    ) {
      return;
    }

    if (businessDivision.value === 'CORPORATION') {
      if (!corporationRegistrationNumber) {
        return;
      }
    }

    let data = form.values();

    let formData = new FormData();

    formData.append('accountHolder', data.accountHolder);
    formData.append('accountNumber', data.accountHolder);
    formData.append('address', data.address);
    formData.append('bankCode', data.bankCode.value);
    formData.append('businessDivision', data.businessDivision.value);
    formData.append('businessItem', data.businessItem);
    formData.append('businessType', data.businessType);
    formData.append(
      'calculationReceivingMethod',
      data.calculationReceivingMethod
    );
    formData.append('claimTelephone', data.claimTelephone.replace(/-/gi, ''));
    formData.append('address', data.address);
    formData.append('detailAddress', data.detailAddress);
    formData.append('roadAddress', data.roadAddress);
    formData.append('zip', data.zip);
    formData.append('companyName', data.companyName);
    formData.append(
      'companyRegistrationNumber',
      data.companyRegistrationNumber.replace(/-/gi, '')
    );
    formData.append(
      'corporationRegistrationNumber',
      data.corporationRegistrationNumber.replace(/-/gi, '')
    );

    formData.append('departureName', data.departureName);
    formData.append('departureAddress', data.departureAddress);
    formData.append('departureDetailAddress', data.departureDetailAddress);
    formData.append('departureRoadAddress', data.departureRoadAddress);
    formData.append(
      'departureTelephone',
      data.departureTelephone.replace(/-/gi, '')
    );
    formData.append('departureZip', data.departureZip);
    formData.append('email', data.email);
    formData.append('fax', data.fax.replace(/-/gi, ''));
    formData.append('mailorderBusiness', data.mailorderBusiness);
    formData.append(
      'mailorderRegistrationNumber',
      data.mailorderRegistrationNumber
    );

    formData.append('managerEmail', data.managerEmail);
    formData.append('managerMobile', data.managerMobile.replace(/-/gi, ''));
    formData.append('managerName', data.managerName);
    formData.append(
      'managerTelephone',
      data.managerTelephone.replace(/-/gi, '')
    );
    formData.append('mobile', data.mobile.replace(/-/gi, ''));
    formData.append('name', data.representativeName);
    formData.append('representativeName ', data.representativeName);

    formData.append('notReportingType', data.notReportingType);
    formData.append('password', data.password);
    if (data.profilePhoto) formData.append('profilePhoto', data.profilePhoto);
    formData.append('returnAddress', data.returnAddress);
    formData.append('returnDetailAddress', data.returnDetailAddress);
    formData.append('returnName', data.returnName);
    formData.append('returnRoadAddress', data.returnRoadAddress);
    formData.append('returnTelephone', data.returnTelephone.replace(/-/gi, ''));
    formData.append('returnZip', data.returnZip);
    formData.append('roadAddress', data.roadAddress);
    formData.append('storeIntroduction', data.storeIntroduction);
    formData.append('storeName', data.storeName);
    // formData.append("userType", data.userType);

    if (data.businessRegistration)
      formData.append('businessRegistration', data.businessRegistration);
    if (data.certificateSeal)
      formData.append('certificateSeal', data.certificateSeal);
    if (data.entityRegistrationCertificate)
      formData.append(
        'entityRegistrationCertificate',
        data.entityRegistrationCertificate
      );
    if (data.representativeBankCopy)
      formData.append('representativeBankCopy', data.representativeBankCopy);
    if (data.mailorderRegistration)
      formData.append('mailorderRegistration', data.mailorderRegistration);

    formData.append('userType', 'BUSINESS_SELLER');

    formData.append(
      'agreeCollectPersonalInfoTos',
      termData.agreeCollectPersonalInfoTos
    );
    formData.append('agreeEmailReception', termData.agreeEmailReception);
    formData.append('agreePurchaseTos', termData.agreePurchaseTos);
    formData.append('agreeSaleTos', termData.agreeSaleTos);
    formData.append('agreeSmsReception', termData.agreeSmsReception);

    console.log(formData);

    API.user.post('/signUpBusinessUser', { formData }).then(function(res) {
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

    // 통신판매업 신고 validation
    if (form.$('mailorderBusiness').value === 'true') {
      form.$('notReportingType').set('value', '');
      if (!form.$('mailorderRegistrationNumber').value) {
        form
          .$('mailorderRegistrationNumber')
          .invalidate('통신 판매업 신고 번호를 입력하셔야 합니다.');
      }
    } else {
      form.$('mailorderRegistrationNumber').set('value', '');
      if (!form.$('notReportingType').value) {
        form
          .$('notReportingType')
          .invalidate('미신고 사유를 입력하셔야 합니다.');
      }
    }

    let businessDivision = form.$('businessDivision').value;
    let corporationRegistrationNumber = form.$('corporationRegistrationNumber')
      .value;

    // 법인 사업자일 때 법인 등록번호 확인
    if (businessDivision.value === 'CORPORATION') {
      if (!corporationRegistrationNumber) {
        form
          .$('corporationRegistrationNumber')
          .invalidate('법인 등록번호는 필수 정보입니다.');
      }
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

    let form = Form.signUpBusiness;
    let data = form.values();

    if (field.path === 'managerSameAsUser' && field.value === true) {
      form.$('managerName').set(data.businessName);
      form.$('managerEmail').set(data.email);
      form.$('managerMobile').set(data.businessMobile);
    } else if (field.path === 'originSameAsUser' && field.value === true) {
      form.$('originName').set('출고지');
      // 전화번호 불러오는 로직
      if (data.managerMobile) {
        form.$('originTelephone').set(data.managerMobile);
      } else if (data.businessMobile) {
        form.$('originTelephone').set(data.businessMobile);
      }
      form.$('originAddress').set(data.businessAddress);
      form.$('originDetailAddress').set(data.businessDetailAddress);
    } else if (field.path === 'returnSameAsUser' && field.value === true) {
      form.$('returnName').set('반품지');
      if (data.managerMobile) {
        form.$('returnTelephone').set(data.managerMobile);
      } else if (data.businessMobile) {
        form.$('returnTelephone').set(data.businessMobile);
      }
      form.$('returnAddress').set(data.businessAddress);
      form.$('returnDetailAddress').set(data.businessDetailAddress);
    }
  },

  // onFocus: field => {
  //   console.log('-> onFocus HOOK -', field.path, field.value);
  // },

  onBlur: field => {
    console.log('-> onBlur HOOK -', field.path, field.value);

    // 모바일 번호 입력시
    // 숫자만 입력받도록 처리
    if (field.path === 'mobileNumber') {
      let checkMobileNumber = field.value;

      checkMobileNumber = checkMobileNumber.replace(/[^0-9]/g, '');
      field.set(checkMobileNumber);
    }
  },
};

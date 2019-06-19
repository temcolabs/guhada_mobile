import Axios from 'axios';
import Router from 'next/router';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import API from 'lib/API';

function replaceComma(value) {
  return value.toString().replace(/\,/g, '');
}

Date.prototype.yyyymmdd = function() {
  return this.toISOString().slice(0, 16);
};

export default {
  onInit() {
    // override default bindings for all text inputs
  },

  onSuccess(form) {
    inject('productadd');
    console.log(form);
    console.log('-> onSubmit HOOK -', form.path, form.value);
    let data = form.values();
    console.log(data);
    let formData = new FormData();

    formData.append('brandId', data.brandId);
    formData.append('categoryId', data.categoryId);
    formData.append('sellerId', 20);
    // formData.append("modelNumber", data.modelNumber);
    formData.append('productStatus', data.productStatus);
    formData.append('season', data.season.value);
    formData.append('name', data.name);
    formData.append('modelNumber', data.modelNumber);
    // formData.append("hiddenProductName", data.hiddenProductName);
    // 품번?
    // formData.append("", data.);
    console.log(replaceComma(data.sellPrice));
    formData.append('sellPrice', replaceComma(data.sellPrice));
    formData.append('setDiscount', data.setDiscount);
    formData.append('discountValue', replaceComma(data.discountValue));
    formData.append('discountType', replaceComma(data.discountType));
    formData.append('setDiscountPeriod', data.setDiscountPeriod);
    formData.append('discountStartAt', data.discountStartAt.yyyymmdd());
    formData.append('discountEndAt', data.discountStartAt.yyyymmdd());
    formData.append('setDisplayPeriod', data.setDisplayPeriod);
    formData.append('displayStartAt', data.displayStartAt.yyyymmdd());
    formData.append('displayEndAt', data.displayEndAt.yyyymmdd());
    formData.append('vat', data.vat);
    formData.append('totalStock', replaceComma(data.totalStock));

    for (let i = 0; i < data.images.length; i++) {
      formData.append('images[' + i + ']', data.images[i]);
      console.log(toJS(data.images[i]));
    }

    formData.append('description', data.description);
    formData.append('setSelectOption', data.setSelectOption);
    // formData.append("selectOptions", data.selectOptions);

    for (let i = 0; i < data.selectOptions.length; i++) {
      formData.append(
        'selectOptions[' + i + '].label',
        data.selectOptions[i].label
      );
      for (let j = 0; j < data.selectOptions[i].attributes.length; j++) {
        formData.append(
          'selectOptions[' + i + '].attributes[' + j + '].name',
          data.selectOptions[i].attributes[j].name
        );
        if (data.selectOptions[i].attributes[j].rgb)
          formData.append(
            'selectOptions[' + i + '].attributes[' + j + '].rgb',
            data.selectOptions[i].attributes[j].rgb
          );
      }
    }

    // formData.append("selectOptionResults", data.selectOptionResults);
    for (let i = 0; i < data.selectOptionResults.length; i++) {
      formData.append(
        'selectOptionResults[' + i + '].label1',
        data.selectOptionResults[i].label1
      );
      formData.append(
        'selectOptionResults[' + i + '].attribute1',
        data.selectOptionResults[i].attribute1
      );
      formData.append(
        'selectOptionResults[' + i + '].rgb1',
        data.selectOptionResults[i].rgb1
      );
      formData.append(
        'selectOptionResults[' + i + '].label2',
        data.selectOptionResults[i].label2
      );
      formData.append(
        'selectOptionResults[' + i + '].attribute2',
        data.selectOptionResults[i].attribute2
      );
      formData.append(
        'selectOptionResults[' + i + '].price',
        data.selectOptionResults[i].price
      );
      formData.append(
        'selectOptionResults[' + i + '].rgb2',
        data.selectOptionResults[i].rgb2
      );
      formData.append(
        'selectOptionResults[' + i + '].stock',
        data.selectOptionResults[i].stock
      );
      formData.append(
        'selectOptionResults[' + i + '].status',
        data.selectOptionResults[i].status
      );
      formData.append(
        'selectOptionResults[' + i + '].managingCode',
        data.selectOptionResults[i].managingCode
      );
      formData.append(
        'selectOptionResults[' + i + '].used',
        data.selectOptionResults[i].used
      );
      formData.append(
        'selectOptionResults[' + i + '].image',
        data.selectOptionResults[i].image
      );
    }
    // 검색 옵션 추가 필요
    /////////////////////
    formData.append('searchKeyword', data.searchKeyword);
    // 배송 및 반품
    formData.append('shipExpenseType', data.shipExpenseType.value);
    formData.append('shipExpense', 3000);
    formData.append('quickAvailable', data.quickAvailable);
    formData.append('bundleAvailable', data.bundleAvailable);
    formData.append('iolatedAreaAvailable', data.iolatedAreaAvailable);
    formData.append('departureAddress', data.departureAddress);
    formData.append('departureRoadAddress', '서울시 강남구 논현로 75길 8');
    formData.append('departureDetailAddress', data.departureDetailAddress);
    formData.append('departureZip', '06247');
    formData.append('departureTelephone', '023404812');
    formData.append('departureName', '템코네트웍스');
    formData.append('claimShipCompanyCode', data.claimShipCompanyCode.value);
    formData.append('claimShipExpenseType', data.claimShipExpenseType);
    formData.append('claimShipExpenseOrder', data.claimShipExpenseOrder);
    formData.append('returnShipExpense', data.returnShipExpense);
    formData.append('exchangeShipExpense', data.exchangeShipExpense);
    formData.append('claimAddress', data.claimAddress);
    formData.append('claimRoadAddress', '서울시 강남구 논현로 75길 8');
    formData.append('claimDetailAddress', data.claimDetailAddress);
    formData.append('claimZip', '06247');
    formData.append('claimTelephone', '023404812');
    formData.append('claimName', '템코네트웍스');
    /////////////////////
    formData.append('asInfo', data.asInfo);
    formData.append('asTelephone', data.asTelephone);
    formData.append('asDesc', data.asDesc);
    formData.append('originType', data.originType.value);
    formData.append('parallelImport', data.parallelImport);
    formData.append('kcCertified', data.kcCertified);
    formData.append('purchasableMinor', data.purchasableMinor);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
      if (pair[1] === undefined || pair[1] === '' || pair[1] === null) {
        formData.delete(pair[0]);
      }
    }

    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    console.log(header);
    API.product.post('/products', { formData }).then(function(res) {
      console.log(res.data);
      let data = res.data;

      if (data.resultCode === 200) {
        alert('등록 되었습니다.');

        API.product
          .get('/deals/' + data.data, { formData })
          .then(function(res) {
            console.log(res.data);
            let data = res.data;
            console.log(data);
            Router.push('/');
          });
      } else {
        alert('??');
      }
    });
  },

  onError(form) {
    console.log('Form Values', form.values());
    console.log('Form Errors', form.errors());
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

import Axios from 'axios';
import { observable } from 'mobx';
import API from 'lib/API';

let customOption = observable({
  country: [
    { value: 'resident', label: '내국인' },
    { value: 'foreigner', label: '외국인' },
  ],
  gender: [{ value: 'MALE', label: '남' }, { value: 'FEMALE', label: '여' }],
  mailorderBusiness: [
    { value: 'true', label: '신고' },
    { value: 'false', label: '미신고' },
  ],
  telecom: [
    { value: 'skt', label: 'SKT' },
    { value: 'kt', label: 'KT' },
    { value: 'lgu', label: 'LGU' },
    { value: 'skt_cheap', label: 'SKT알뜰폰' },
    { value: 'kt_cheap', label: 'KT알뜰폰' },
    { value: 'lgu_cheap', label: 'LGU알뜰폰' },
  ],
  year: [],
  month: [
    { value: '01', label: '1월' },
    { value: '02', label: '2월' },
    { value: '03', label: '3월' },
    { value: '04', label: '4월' },
    { value: '05', label: '5월' },
    { value: '06', label: '6월' },
    { value: '07', label: '7월' },
    { value: '08', label: '8월' },
    { value: '09', label: '9월' },
    { value: '10', label: '10월' },
    { value: '11', label: '11월' },
    { value: '12', label: '12월' },
  ],
  day: [
    { value: '01', label: '1일' },
    { value: '02', label: '2일' },
    { value: '03', label: '3일' },
    { value: '04', label: '4일' },
    { value: '05', label: '5일' },
    { value: '06', label: '6일' },
    { value: '07', label: '7일' },
    { value: '08', label: '8일' },
    { value: '09', label: '9일' },
    { value: '10', label: '10일' },
    { value: '11', label: '11일' },
    { value: '13', label: '13일' },
    { value: '14', label: '14일' },
    { value: '15', label: '15일' },
    { value: '16', label: '16일' },
    { value: '17', label: '17일' },
    { value: '18', label: '18일' },
    { value: '19', label: '19일' },
    { value: '20', label: '20일' },
    { value: '21', label: '21일' },
    { value: '22', label: '22일' },
    { value: '23', label: '23일' },
    { value: '24', label: '24일' },
    { value: '25', label: '25일' },
    { value: '26', label: '26일' },
    { value: '27', label: '27일' },
    { value: '28', label: '28일' },
    { value: '29', label: '29일' },
    { value: '30', label: '30일' },
    { value: '31', label: '31일' },
  ],
  bank: [
    // { value: "005", label: "외환은행" },
    // { value: "003", label: "기업은행" },
    // { value: "006", label: "국민은행" },
    // { value: "011", label: "농협" },
    // { value: "026", label: "신한은행" },
    // { value: "081", label: "하나은행" },
    // { value: "071", label: "우체국" },
    // { value: "039", label: "경남은행" },
    // { value: "020", label: "우리은행" },
    // { value: "032", label: "부산은행" },
    // { value: "007", label: "수협" },
    // { value: "031", label: "대구은행" }
  ],
  companyDivision: [
    { value: 'CORPORATION', label: '법인 사업자' },
    { value: 'PERSONAL', label: '개인 사업자' },
    { value: 'SIMPLE', label: '간이 과세자' },
  ],
  businessMailOrderReason: [
    { value: '신고 준비중', label: '신고 준비중' },
    { value: '기타', label: '기타' },
  ],
  calculationReceivingMethod: [
    { value: 'SALES_DEPOSIT', label: '판매예치금' },
    { value: 'ACCOUNT_TRANSFER', label: '계좌송금' },
  ],
});

export default customOption;

API.user.get('/banks').then(function(res) {
  let data = res.data;

  if (data.resultCode === 200) {
    let bankData = data.data;
    bankData.forEach(element => {
      customOption.bank.push({
        value: element.bankCode,
        label: element.bankName,
      });
    });
  } else {
  }
});

for (let x = 2019; x > 1910; x--) {
  customOption.year.push({ value: x.toString(), label: x + '년' });
}

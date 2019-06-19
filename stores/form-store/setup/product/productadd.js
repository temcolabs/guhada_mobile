import hooks from "../../hooks/product/ProductAddHooksField";

let productAddOption = {
  optionName: [
    { value: "color", label: "색상" },
    { value: "size", label: "사이즈" },
    { value: "etc", label: "직접입력" }
  ],
  season: [
    { value: "19FW", label: "19FW" },
    { value: "19SS", label: "19SS" },
    { value: "20FW", label: "20FW" },
    { value: "20SS", label: "20SS" }
  ],
  origin: [
    { value: "DOMESTIC", label: "국내" },
    { value: "OVERSEA", label: "해외" },
    { value: "REFERENCE", label: "상세설명참조" },
    { value: "OTHER", label: "직접입력" }
  ],
  ship: [
    { value: "FREE", label: "무료배송" },
    { value: "CONDITION_FREE", label: "조건부무료" },
    { value: "PAID", label: "결제" },
    { value: "AFTER_PAID", label: "착불" }
  ],
  shipCode: [
    { value: "01", label: "우체국택배" },
    { value: "04", label: "CJ대한통운" },
    { value: "05", label: "한진택배" },
    { value: "06", label: "로젠택배" },
    { value: "08", label: "롯데택배" },
    { value: "11", label: "일양로지스" },
    { value: "12", label: "EMS" },
    { value: "13", label: "DHL" },
    { value: "16", label: "한의사랑택배" },
    { value: "17", label: "천일택배" },
    { value: "18", label: "건영택배" },
    { value: "20", label: "한덱스" },
    { value: "21", label: "Fedex" },
    { value: "22", label: "대신택배" },
    { value: "23", label: "경동택배" },
    { value: "24", label: "CVSnet 편의점택배" },
    { value: "25", label: "TNT Express" },
    { value: "28", label: "GSMNtoN(인로스)" },
    { value: "29", label: "에어보이익스프레스" },
    { value: "30", label: "KGL네트웍스" },
    { value: "32", label: "합동택배" },
    { value: "33", label: "DHL Global Mail" },
    { value: "34", label: "i-Parcel" },
    { value: "37", label: "범한판토스" },
    { value: "38", label: "APEX(ECMS Express)" },
    { value: "40", label: "굿투럭" },
    { value: "41", label: "GSI Express" },
    { value: "42", label: "CJ대한통운 국제특송" },
    { value: "43", label: "애니트랙" },
    { value: "44", label: "SLX" },
    { value: "45", label: "호남택배" },
    { value: "46", label: "CU편의점택배" },
    { value: "52", label: "세방" },
    { value: "53", label: "농협택배" },
    { value: "54", label: "홈픽택배" },
    { value: "55", label: "EuroParcel(유로택배)" },
    { value: "56", label: "KGB택배" },
    { value: "57", label: "Cway Express" },
    { value: "99", label: "롯데글로벌 로지스" }
  ]
};

export default {
  fields: {
    brandId: {
      type: "text",
      name: "email",
      label: "브랜드명 검색",
      placeholder: "브랜드명 검색"
    },
    brandSearch: { placeholder: "브랜드명 검색", hooks },
    categoryId: {},
    categorySearch: { placeholder: "카테고리명 검색" },
    sellerId: {},
    modelNumber: {
      placeholder: "품번 입력",
      hooks
    },
    productStatus: {},
    season: {
      placeholder: "시즌 선택",
      extra: productAddOption.season
    },
    name: {
      placeholder: "상품명을 입력해주세요. [제품명][상품군]"
    },
    hiddenProductName: {},

    sellPrice: {
      placeholder: "원",
      hooks
    },
    setDiscount: { hooks },
    discountValue: {
      type: "number",
      value: "",
      hooks
    },
    discountType: {
      value: "FIXED_AMOUNT"
    },
    setDiscountPeriod: {
      type: "checkbox",
      id: "setDiscountPeriod",
      name: "setDiscountPeriod",
      label: "특정기간만 할인"
    },
    discountStartAt: {
      value: new Date()
    },
    discountEndAt: {
      value: new Date()
    },
    setDisplayPeriod: {},
    displayStartAt: { value: new Date() },
    displayEndAt: { value: new Date() },
    vat: {},
    totalStock: {
      placeholder: "총 재고수량",
      hooks
    },
    images: {},
    description: {},
    setSelectOption: {},
    selectOptions: {},
    selectOptionResults: {},
    searchKeyword: {},
    //// 배송 및 반품 ///////
    shipExpenseType: {
      placeholder: "배송비 종류",
      extra: productAddOption.ship
    },
    shipExpense: {},
    quickAvailable: {},
    bundleAvailable: {},
    iolatedAreaAvailable: {},
    departureAddress: {},
    departureRoadAddress: {},
    departureDetailAddress: {},
    departureZip: {},
    departureTelephone: {},
    departureName: {},
    claimShipCompanyCode: {
      placeholder: "택배사",
      extra: productAddOption.shipCode
    },
    claimShipExpenseType: {},
    claimShipExpenseOrder: {},
    returnShipExpense: {},
    exchangeShipExpense: {},
    claimAddress: {},
    claimRoadAddress: {},
    claimDetailAddress: {},
    claimZip: {},
    claimTelephone: {},
    claimName: {},
    ///////////////////////////////////////////
    asInfo: {},
    asTelephone: {},
    asDesc: {},
    originType: {
      placeholder: "원산지 종류",
      extra: productAddOption.origin
    },
    parallelImport: {
      rules: "boolean"
    },
    kcCertified: {
      rules: "boolean"
    },
    purchasableMinor: {
      rules: "required|boolean"
    },

    manufacturer: {},
    selectOptionViewType: {},
    selectOptionSortType: {},
    ////////////////////////
    selectOptionName: {
      extra: productAddOption.optionName
    },
    productOption: {}
  }
};

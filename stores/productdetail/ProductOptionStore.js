import React from 'react';
import { observable, action } from 'mobx';
import { isServer } from 'lib/isServer';
import API from 'lib/API';
import { devLog } from 'lib/devLog';

export default class ProductOptionStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable options = {
    tempOptions: [],
    realOptions: [],
    selectedOption: null,
    selectedQuantity: 1,
    selectedOpitonPrice: 0,
    selectedTotalPrice: 0,
  };
  @observable shipExpenseType = '';

  @observable benefitToggle = false;
  @observable benefitPoint = 0;
  @observable benefitCoupon = [];
  @observable quantityMinusBtn = '/static/icon/quantity_minus_off.png';
  @observable quantityPlusBtn = '/static/icon/quantity_plus_on.png';

  @action
  getOptions = () => {
    let { options } = this.root.productdetail.deals;
    let tempAttribute = '';
    let tempArray = [];
    if (options.length === 0) {
      this.setProductNoOptionInit();
    } else {
      this.setProductOptionInit();
      for (let i = 0; i < options.length; i++) {
        tempAttribute = '';
        tempArray = [];
        for (let key in options[i]) {
          if (key.indexOf('attribute') !== -1) {
            tempArray.push(options[i][key]);
          }
        }
        for (let x = 0; x < tempArray.length; x++) {
          tempAttribute += tempArray[x] + ' / ';
        }

        tempAttribute = tempAttribute.substr(0, tempAttribute.length - 3);

        this.options.tempOptions.push({
          value: tempAttribute,
          label:
            options[i].price === 0
              ? tempAttribute + '\u00A0(품절)'
              : tempAttribute +
                '\u00A0 (' +
                options[i].price.toLocaleString() +
                '원)',
          icon: '',
          stock: options[i].stock,
          price: options[i].price,
          id: options[i].dealOptionSelectId,
          color: options[i].rgb1,
          isDisabled: options[i].stock <= 0 ? true : false,
        });
      }
    }
    this.options.realOptions = this.options.tempOptions;
  };

  setProductNoOptionInit = () => {
    this.options = {
      noOption: true,
      selectedQuantity: 1,
      selectedOpitonPrice: 0,
      selectedTotalPrice: this.root.productdetail.deals.discountPrice.toLocaleString(),
      selectedOption: {
        stock: this.root.productdetail.deals.totalStock,
        price: 0,
      },
    };
  };

  setProductOptionInit = () => {
    this.options = {
      tempOptions: [
        {
          label: '선택안함',
          value: null,
          icon: null,
        },
      ],
      realOptions: [],
      selectedOption: null,
      selectedQuantity: 1,
      selectedOpitonPrice: 0,
      selectedTotalPrice: this.root.productdetail.deals.discountPrice.toLocaleString(),
    };
  };

  @action
  selectOption = value => {
    if (value.label === '선택안함') {
      this.options.selectedOption = null;
      this.options.selectedOpitonPrice = 0;
      this.options.selectedTotalPrice = this.root.productdetail.deals.discountPrice.toLocaleString();
      return false;
    }

    if (this.options.selectedOption) {
      if (this.options.selectedOption.id !== value.id) {
        this.options.selectedOption = value;
        this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
        this.options.selectedQuantity = 1;
        this.getTotalPrice();
      }
    } else {
      this.options.selectedOption = value;
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
      this.options.selectedQuantity = 1;
      this.getTotalPrice();
    }
  };

  getTotalPrice = () => {
    this.options.selectedTotalPrice = (
      this.root.productdetail.deals.discountPrice *
        this.options.selectedQuantity +
      this.options.selectedOption.price * this.options.selectedQuantity
    ).toLocaleString();

    if (this.root.productdetail.deals.options.length === 0) {
      this.options.selectedOpitonPrice = 0;
    } else {
      this.options.selectedOpitonPrice =
        this.options.selectedOption.price > 0
          ? '(+)' +
            (
              this.options.selectedOption.price * this.options.selectedQuantity
            ).toLocaleString()
          : '(-)' +
            (
              this.options.selectedOption.price * this.options.selectedQuantity
            ).toLocaleString();
    }
  };

  @action
  quantityChangeOutFocus = e => {
    let value = e.target.value;
    value = parseInt(value);
    if (isNaN(value) || value <= 0) {
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
      this.quantityPlusBtn = '/static/icon/quantity_plus_on.png';
      this.options.selectedQuantity = 1;
      this.getTotalPrice();
    }
  };

  @action
  quantityMinus = () => {
    if (this.options.selectedQuantity <= 1) {
      this.options.selectedQuantity = 1;
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
      return false;
    }

    if (this.options.selectedQuantity === 2) {
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
    }

    this.quantityPlusBtn = '/static/icon/quantity_plus_on.png';
    this.options.selectedQuantity = this.options.selectedQuantity - 1;
    this.getTotalPrice();
  };

  @action
  quantityPlus = () => {
    if (this.options.selectedQuantity >= this.options.selectedOption.stock) {
      this.root.alert.showAlert({
        content: '재고수량 ' + this.options.selectedOption.stock + ' 개 초과',
      });
      return false;
    }
    if (
      this.options.selectedQuantity ===
      this.options.selectedOption.stock - 1
    ) {
      this.quantityPlusBtn = '/static/icon/quantity_plus_off.png';
    }
    this.quantityMinusBtn = '/static/icon/quantity_minus_on.png';
    this.options.selectedQuantity = this.options.selectedQuantity + 1;

    this.getTotalPrice();
  };

  @action
  quantityChange = e => {
    let value = e.target.value;
    value = parseInt(value);
    if (isNaN(value)) {
      this.options.selectedQuantity = '';
      return false;
    } else if (value > this.options.selectedOption.stock) {
      this.root.alert.showAlert({
        content: '재고수량 ' + this.options.selectedOption.stock + ' 개 초과',
      });
      this.options.selectedQuantity = this.options.selectedOption.stock;
      this.getTotalPrice();
      this.quantityPlusBtn = '/static/icon/quantity_plus_off.png';
      this.quantityMinusBtn = '/static/icon/quantity_minus_on.png';
      return false;
    } else if (value < 0) {
      return false;
    } else {
      if (value === 0) {
        this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
        this.options.selectedQuantity = 1;
        this.getTotalPrice();
        return false;
      }
      value === this.options.selectedOption.stock
        ? (this.quantityPlusBtn = '/static/icon/quantity_plus_off.png')
        : (this.quantityPlusBtn = '/static/icon/quantity_plus_on.png');

      this.quantityMinusBtn = '/static/icon/quantity_minus_on.png';
      this.options.selectedQuantity = value;
      this.getTotalPrice();
    }
  };

  @action
  getLabelColor = ({ icon, color, label }) => {
    return (
      <div style={{ alignItems: 'center', display: 'flex' }}>
        {color ? (
          <span
            style={{
              width: 26,
              height: 26,
              backgroundColor: color,
              border: '1px solid #ddd',
              marginRight: 8,
            }}
          >
            {icon}
          </span>
        ) : (
          <span
            style={{
              width: 26,
              height: 26,
              backgroundColor: color,
              border: 'none',
              marginRight: 8,
            }}
          >
            {icon}
          </span>
        )}

        <span style={{ fontSize: 14 }}>{label}</span>
      </div>
    );
  };

  @action
  getShipExpenseType = () => {
    switch (this.root.productdetail.deals.shipExpenseType) {
      case 'FREE':
        this.shipExpenseType = '무료배송';
        break;
      case 'CONDITION_FREE':
        this.shipExpenseType = '조건부무료';
        break;
      case 'PAID':
        this.shipExpenseType = '유료배송';
        break;
      case 'AFTER_PAID':
        this.shipExpenseType = '착불배송';
        break;
      default:
    }
  };

  @action
  benefitClick = () => {
    this.benefitToggle = !this.benefitToggle;
  };

  @action
  getBenefitData = () => {
    let bundleList = {
      bundleList: [
        {
          bundlePrice: this.root.productdetail.deals.shipExpense,
          orderProdList: [
            {
              dcategoryId: this.root.productdetail.deals.dCategoryId,
              dealId: this.root.productdetail.deals.dealsId,
              discountPrice: this.root.productdetail.deals.discountPrice,
              lcategoryId: this.root.productdetail.deals.lCategoryId,
              mcategoryId: this.root.productdetail.deals.mCategoryId,
              productPrice: this.root.productdetail.deals.sellPrice,
              scategoryId: this.root.productdetail.deals.sCategoryId,
            },
          ],
        },
      ],
      pointType: 'BUY',
      serviceType: 'FRONT',
    };
    API.benefit
      .post(`/process/due-save`, bundleList)
      .then(res => {
        const { data } = res;
        if (res.status === 200) {
          this.benefitPoint = 0;
          for (let i = 0; i < data.data.dueSavePointList.length; i++) {
            this.benefitPoint += data.data.dueSavePointList[i].totalPoint;
          }
        }
      })
      .catch(err => {
        this.root.alert.showAlert({
          content: '혜택(포인트) 조회 에러',
        });
      });
  };

  @action
  getCouponData = () => {
    API.benefit
      .get(
        `/coupons/process/due-save?DCategoryId=${215}&LCategoryId=${1}&MCategoryId=${4}&SCategoryId=${18}&dealId=${7}&paymentPrice=${250000}&sellerId=${251}&saveActionType=BUY&serviceType=FRONT`
      )
      .then(res => {
        const { data } = res;
        if (res.status === 200) {
          this.benefitCoupon = data.data;
          devLog(this.benefitCoupon, 'this.benefitCoupon');
        }
      })
      .catch(err => {
        this.root.alert.showAlert({
          content: '혜택(쿠폰) 조회 에러',
        });
      });
  };
}

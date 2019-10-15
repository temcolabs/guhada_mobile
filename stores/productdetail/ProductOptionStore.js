import React from 'react';
import { observable, action, toJS } from 'mobx';
import { isServer } from 'lib/isServer';
import API from 'lib/API';
import { devLog } from 'lib/devLog';
import _ from 'lodash';
import { pushRoute } from 'lib/router';
import qs from 'qs';
import moment from 'moment';
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
  @observable dueSavebenefitCoupon = [];
  @observable quantityMinusBtn = '/static/icon/quantity_minus_off.png';
  @observable quantityPlusBtn = '/static/icon/quantity_plus_on.png';

  @observable couponIsOpen = false;
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
          tempAttribute += tempArray[x] + ' ';
        }

        tempAttribute = tempAttribute.substr(0, tempAttribute.length);

        this.options.tempOptions.push({
          value: tempAttribute,
          label:
            options[i].stock === 0
              ? `${tempAttribute} (품절)`
              : options[i].price === 0
              ? tempAttribute
              : options[i].price > 0
              ? `${tempAttribute} (+${options[i].price.toLocaleString()}원)`
              : `${tempAttribute} (-${options[i].price.toLocaleString()}원)`,
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
        // {
        //   label: '선택안함',
        //   value: null,
        //   icon: null,
        // },
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
        content: '재고수량 초과',
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
        content: '재고수량 초과',
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
      <div style={{ position: 'relative' }}>
        <div style={{ clear: 'both' }}>
          {color ? (
            <div
              style={{
                float: 'left',
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: color,
                border: '1px solid #ddd',
                marginRight: 8,
              }}
            >
              {icon}
            </div>
          ) : null}
          <div
            style={{
              float: 'left',
              fontSize: 14,
              height: 22,
              lineHeight: '22px',
            }}
          >
            {label}
          </div>
        </div>
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
    if (this.root.login.loginStatus === 'LOGIN_DONE') {
      let userId = this.root.login.loginInfo.userId;
      let bundleList = {
        bundleList: [
          {
            bundlePrice: this.root.productdetail.deals.shipExpense,
            orderProdList: [
              {
                dealId: this.root.productdetail.deals.dealsId,
                discountPrice: this.root.productdetail.deals.discountPrice,
                productPrice: this.root.productdetail.deals.sellPrice,
                dcategoryId: this.root.productdetail.deals.dCategoryId,
                lcategoryId: this.root.productdetail.deals.lCategoryId,
                mcategoryId: this.root.productdetail.deals.mCategoryId,
                scategoryId: this.root.productdetail.deals.sCategoryId,
              },
            ],
          },
        ],
        pointType: 'BUY',
        consumptionType: 'BUY',
        serviceType: 'FRONT',
      };
      API.benefit
        .post(`/process/total-due-save/${userId}`, bundleList)
        .then(res => {
          const { data } = res;
          this.benefitPoint = 0;
          for (let i = 0; i < data.data.dueSavePointList.length; i++) {
            this.benefitPoint += data.data.dueSavePointList[i].totalPoint;
          }
        })
        .catch(err => {
          console.log(err);
          this.benefitPoint = 0;
          // this.root.alert.showAlert({
          //   content: `${_.get(err, 'data.message') || err.message}`,
          // });
        });
    }
  };

  @action
  getCouponData = () => {
    let deals = this.root.productdetail.deals;
    let param = {
      DCategoryId: deals.dCategoryId ? deals.dCategoryId : '',
      LCategoryId: deals.lCategoryId,
      MCategoryId: deals.mCategoryId,
      SCategoryId: deals.sCategoryId,
      dealId: deals.dealId,
      paymentPrice: deals.sellPrice,
      sellerId: deals.sellerId,
      saveActionType: 'BUY',
      serviceType: 'FRONT',
    };
    API.benefit
      .get(`/coupons/process/due-save`, { params: param })
      .then(res => {
        const { data } = res;
        this.dueSavebenefitCoupon = data.data;
        for (let i = 0; i < this.dueSavebenefitCoupon.length; i++) {
          let x = new moment(this.dueSavebenefitCoupon[i].startAt);
          let y = new moment(this.dueSavebenefitCoupon[i].endAt);

          let duration = moment.duration(x.diff(y));
          this.dueSavebenefitCoupon[i].expireAt = -duration._data.days;
        }
      })
      .catch(err => {
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
        // });
      });
  };

  @action
  couponDownModalOpen = () => {
    if (this.dueSavebenefitCoupon.length > 1) {
      this.couponIsOpen = true;
    } else if (this.dueSavebenefitCoupon.length === 1) {
      let deals = this.root.productdetail.deals;
      if (
        this.root.sellerfollow.follows &&
        !this.dueSavebenefitCoupon[0].alreadySaved
      ) {
        let coupon = this.dueSavebenefitCoupon[0];
        let param = {
          dcategoryId: deals.dCategoryId ? deals.dCategoryId : '',
          dealId: deals.dealId,
          lcategoryId: deals.lCategoryId,
          mcategoryId: deals.mCategoryId,
          saveActionType: coupon.saveActionType,
          scategoryId: deals.sCategoryId,
          sellerId: deals.sellerId,
          serviceType: 'FRONT',
          paymentPrice: deals.sellPrice,
          userId: coupon.userId,
        };
        API.benefit
          .post(`/coupons/process/save`, param)
          .then(res => {
            const { data } = res;
            devLog(data, 'data coupon');
            this.root.alert.showAlert({
              content: `쿠폰발급완료`,
            });
            this.dueSavebenefitCoupon[0].alreadySaved = true;
            this.couponDownModalClose();
          })
          .catch(err => {
            console.error(err, ' err');
            // this.root.alert.showAlert({
            //   content: `${_.get(err, 'data.message') || err.message}`,
            // });

            if (_.get(err, 'data.resultCode') === 6017) {
              this.couponDownModalClose();
              pushRoute(
                `/login?${qs.stringify({
                  redirectTo: `/productdetail?deals=${
                    this.root.productdetail.deals.dealsId
                  }`,
                })}`,
                { isReplace: true }
              );
              return false;
            }
          });
      } else {
        this.couponIsOpen = true;
      }
    }
  };

  @action
  couponDownModalClose = () => {
    this.couponIsOpen = false;
  };

  @action
  couponDown = () => {
    let deals = this.root.productdetail.deals;

    if (this.root.sellerfollow.follows) {
      for (let i = 0; i < this.dueSavebenefitCoupon.length; i++) {
        if (!this.dueSavebenefitCoupon[i].alreadySaved) {
          let coupon = this.dueSavebenefitCoupon[i];
          let param = {
            dcategoryId: deals.dCategoryId ? deals.dCategoryId : '',
            dealId: deals.dealId,
            lcategoryId: deals.lCategoryId,
            mcategoryId: deals.mCategoryId,
            saveActionType: coupon.saveActionType,
            scategoryId: deals.sCategoryId,
            sellerId: deals.sellerId,
            serviceType: 'FRONT',
            paymentPrice: deals.sellPrice,
            userId: coupon.userId,
          };
          API.benefit
            .post(`/coupons/process/save`, param)
            .then(res => {
              const { data } = res;
              devLog(data, 'data coupon');
              this.root.alert.showAlert({
                content: `쿠폰발급완료`,
              });
              this.dueSavebenefitCoupon[i].alreadySaved = true;
              this.couponDownModalClose();
            })
            .catch(err => {
              console.error(err, ' err');
              // this.root.alert.showAlert({
              //   content: `${_.get(err, 'data.message') || err.message}`,
              // });

              if (_.get(err, 'data.resultCode') === 6017) {
                this.couponDownModalClose();
                pushRoute(
                  `/login?${qs.stringify({
                    redirectTo: `/productdetail?deals=${
                      this.root.productdetail.deals.dealsId
                    }`,
                  })}`,
                  { isReplace: true }
                );
                return false;
              }
            });
        }
      }
    } else {
      API.user
        .post(`/users/bookmarks`, {
          target: 'SELLER',
          targetId: this.dueSavebenefitCoupon[0].sellerId,
        })
        .then(res => {
          devLog(res, 'res');

          for (let i = 0; i < this.dueSavebenefitCoupon.length; i++) {
            if (!this.dueSavebenefitCoupon[i].alreadySaved) {
              let coupon = this.dueSavebenefitCoupon[i];
              let param = {
                dcategoryId: deals.dCategoryId ? deals.dCategoryId : '',
                dealId: deals.dealId,
                lcategoryId: deals.lCategoryId,
                mcategoryId: deals.mCategoryId,
                saveActionType: coupon.saveActionType,
                scategoryId: deals.sCategoryId,
                sellerId: deals.sellerId,
                serviceType: 'FRONT',
                paymentPrice: deals.sellPrice,
                userId: coupon.userId,
              };
              API.benefit
                .post(`/coupons/process/save`, param)
                .then(res => {
                  const { data } = res;
                  devLog(data, 'data coupon');
                  this.root.alert.showAlert({
                    content: `쿠폰발급완료`,
                  });
                  this.dueSavebenefitCoupon[i].alreadySaved = true;

                  this.couponDownModalClose();
                  this.root.sellerfollow.follows = true;
                })
                .catch(err => {
                  console.error(err, ' err');
                  // this.root.alert.showAlert({
                  //   content: `${_.get(err, 'data.message') || err.message}`,
                  // });

                  if (_.get(err, 'data.resultCode') === 6017) {
                    this.couponDownModalClose();
                    pushRoute(
                      `/login?${qs.stringify({
                        redirectTo: `/productdetail?deals=${
                          this.root.productdetail.deals.dealsId
                        }`,
                      })}`,
                      { isReplace: true }
                    );
                    return false;
                  }
                });
            }
          }
        })
        .catch(err => {
          console.error(err, ' err');
          // this.root.alert.showAlert({
          //   content: `${_.get(err, 'data.message') || err.message}`,
          // });

          if (_.get(err, 'data.resultCode') === 6017) {
            this.couponDownModalClose();
            pushRoute(
              `/login?${qs.stringify({
                redirectTo: `/productdetail?deals=${
                  this.root.productdetail.deals.dealsId
                }`,
              })}`,
              { isReplace: true }
            );
            return false;
          }
        });
    }
  };
}

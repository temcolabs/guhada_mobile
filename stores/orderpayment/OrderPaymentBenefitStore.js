import { observable, action } from 'mobx';
import API from 'lib/API';
import _ from 'lodash';
const isServer = typeof window === 'undefined';

export default class OrderPaymentBenefitStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable myPoint = 0;
  @observable availablePoint = 0;
  @observable dueSavePointTotal = 0;
  @observable dueSaveList = [];

  @observable myCoupon = [];
  @observable couponWithProduct = [];
  @observable selectedCouponList = [];
  @observable couponIndex = 0;
  @observable totalPrice = {
    prodPrice: 0,
    discountPrice: 0,
    resultProdPrice: 0,
  };
  @observable applyCoupon = {
    applyDiscount: 0,
    applyCouponAmount: 0,
  };
  @observable isOpen = false;
  @action
  getAvailablePoint = () => {
    this.availablePoint = this.root.orderpayment.orderPoint.availableTotalPoint;
  };

  @action
  getMyPoint = () => {
    API.benefit
      .get(`/summary`)
      .then(res => {
        let data = res.data.data;
        this.myPoint = data.totalFreePoint + data.totalPaidPoint;
      })
      .catch(err => {
        this.root.alert.showAlert({
          content: `${_.get(err, 'data.message') || 'ERROR'}`,
        });
      });
  };

  @action
  setUsePoint = e => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = Number(value);
    this.root.orderpayment.orderPaymentTotalInfo.usePoint = value;
    if (value > this.availablePoint) {
      this.root.alert.showAlert({
        content: '최대 사용 가능 포인트 초과 입니다.',
      });
      this.root.orderpayment.orderPaymentTotalInfo.usePoint = this.availablePoint;
    }
    this.root.orderpayment.totalPaymentAmount();
    this.getDueSavePoint();
  };

  @action
  pointfullUse = () => {
    if (this.myPoint >= this.availablePoint) {
      this.root.orderpayment.orderPaymentTotalInfo.usePoint = this.availablePoint;
    } else {
      this.root.orderpayment.orderPaymentTotalInfo.usePoint = this.myPoint;
    }

    this.root.orderpayment.totalPaymentAmount();
    this.getDueSavePoint();
  };

  @action
  getDueSavePoint = () => {
    let bundleData = {
      bundleList: [],
      consumptionPoint: this.usePoint,
      consumptionType: 'BUY',
      pointType: 'BUY',
      serviceType: 'FRONT',
    };

    let bundleListData = [];
    this.root.orderpayment.orderProductInfo.map((data, index) => {
      bundleListData = {
        bundlePrice: data.shipExpense,
        orderProdList: [],
      };
      bundleData.bundleList.push(bundleListData);

      for (let i = 0; i < data.quantity; i++) {
        bundleData.bundleList[index].orderProdList.push({
          discountPrice: data.discountDiffPrice / data.quantity,
          orderOptionList: [
            {
              price: data.itemOptionResponse
                ? data.itemOptionResponse.price
                : 0,
            },
          ],
          productPrice: data.productPrice,
        });
      }
    });

    console.log(bundleData, 'bundleData');
    API.benefit
      .post(`/process/due-save`, bundleData)
      .then(res => {
        let data = res.data.data;
        // console.log(res, 'due response');
        this.dueSavePointTotal = 0;
        for (let i = 0; i < data.dueSavePointList.length; i++) {
          this.dueSavePointTotal += data.dueSavePointList[i].totalPoint;
        }
        this.dueSaveList = data.dueSavePointList;
      })
      .catch(err => {
        this.root.alert.showAlert({
          content: `${_.get(err, 'data.message') || 'ERROR'}`,
        });
      });
  };

  @action
  getMyCoupon = () => {
    API.benefit
      .get(`/benefits/summary`)
      .then(res => {
        console.log(res, 'coupon res');
        let { data } = res.data;
        this.myCoupon = data.totalAvailCoupon;
      })
      .catch(err => {
        console.log(err);
        this.root.alert.showAlert({
          content: `${_.get(err, 'data.message') || 'ERROR'}`,
        });
      });
  };
  @action
  setCouponWithProduct = list => {
    this.couponWithProduct = list;

    for (let i = 0; i < this.couponWithProduct.length; i++) {
      for (let a = 0; a < this.couponWithProduct[i].coupon.length; a++) {
        if (this.couponWithProduct[i].coupon[a].discountType === 'RATE') {
          this.couponWithProduct[i].coupon[a].discountPrice =
            this.couponWithProduct[i].product.sellPrice *
            this.couponWithProduct[i].coupon[a].discountRate;

          this.couponWithProduct[i].coupon[a].discountPrice =
            this.couponWithProduct[i].coupon[a].discountPrice >
            this.couponWithProduct[i].coupon[a].maximumDiscountPrice
              ? this.couponWithProduct[i].coupon[a].maximumDiscountPrice
              : this.couponWithProduct[i].coupon[a].discountPrice;
        }
      }
    }

    for (let i = 0; i < this.couponWithProduct.length; i++) {
      this.couponWithProduct[i].coupon = this.couponWithProduct[i].coupon.sort(
        (prev, next) => {
          if (prev.discountPrice < next.discountPrice) {
            return 1;
          }
          if (prev.discountPrice > next.discountPrice) {
            return -1;
          }
          return 0;
        }
      );
    }

    if (this.couponWithProduct.length > 0) {
      this.setSelectedCouponInit();
    }
    this.totalPriceCheck();
  };

  @action
  setSelectedCouponInit = n => {
    let tempArr = [];
    let tempObj = {};
    for (let i = 0; i < this.couponWithProduct.length; i++) {
      tempObj = {};
      tempObj.dealId = this.couponWithProduct[i].dealId;
      tempObj.couponNumber = false;
      tempObj.prodPrice = this.couponWithProduct[i].product.sellPrice;
      tempObj.cartItemId = this.couponWithProduct[i].product.cartItemId;
      tempArr.push(tempObj);
    }
    this.selectedCouponList = tempArr;

    this.setUsed();
  };

  setUsed = () => {
    let tempCouponWithProduct = [...this.couponWithProduct];
    for (let i = 0; i < this.selectedCouponList.length; i++) {
      if (this.couponWithProduct[i].coupon.length > 0) {
        if (!this.selectedCouponList[i].couponNumber) {
          for (let a = 0; a < this.couponWithProduct[i].coupon.length; a++) {
            if (!this.couponWithProduct[i].coupon[a].usedId) {
              this.selectedCouponList[i].couponNumber = this.couponWithProduct[
                i
              ].coupon[a].couponNumber;

              this.selectedCouponList[i].discountPrice = this.couponWithProduct[
                i
              ].coupon[a].discountPrice;
              break;
            }
          }
          for (let x = 0; x < this.couponWithProduct.length; x++) {
            if (this.couponWithProduct[x].coupon.length > 0) {
              for (
                let t = 0;
                t < this.couponWithProduct[x].coupon.length;
                t++
              ) {
                if (tempCouponWithProduct[x].coupon[t]) {
                  if (
                    tempCouponWithProduct[x].coupon[t].couponNumber ===
                    this.selectedCouponList[i].couponNumber
                  ) {
                    tempCouponWithProduct[x].coupon[
                      t
                    ].usedId = this.selectedCouponList[i].dealId;
                  }
                }
              }
            }
          }
          this.couponWithProduct = tempCouponWithProduct;
        }
      }
    }

    this.totalPriceCheck();
  };

  @action
  setSelectCoupon = (id, number, idx) => {
    let tempArr = [...this.couponWithProduct];
    let tempNumber = 0;

    for (let i = 0; i < this.selectedCouponList.length; i++) {
      if (this.selectedCouponList[i].dealId === id) {
        tempNumber = this.selectedCouponList[i].couponNumber;
        this.selectedCouponList[i].couponNumber = number;
      }
    }

    if (!number) {
      for (let i = 0; i < this.couponWithProduct.length; i++) {
        for (let a = 0; a < this.couponWithProduct[i].coupon.length; a++) {
          if (tempArr[i].coupon[a].couponNumber === tempNumber) {
            tempArr[i].coupon[a].usedId = false;
          }
        }
      }
    } else {
      for (let i = 0; i < this.couponWithProduct.length; i++) {
        for (let a = 0; a < this.couponWithProduct[i].coupon.length; a++) {
          if (tempArr[i].coupon[a].usedId === id) {
            tempArr[i].coupon[a].usedId = false;
          }
          if (tempArr[i].coupon[a].couponNumber === number) {
            tempArr[i].coupon[a].usedId = id;
            this.selectedCouponList[i].discountPrice =
              tempArr[i].coupon[a].discountPrice;
          }
        }
      }
    }
    this.couponWithProduct = tempArr;

    this.totalPriceCheck();
  };

  totalPriceCheck = () => {
    this.totalPrice = {
      prodPrice: 0,
      discountPrice: 0,
      resultProdPrice: 0,
    };
    for (let i = 0; i < this.couponWithProduct.length; i++) {
      this.totalPrice.prodPrice += this.couponWithProduct[i].product.sellPrice;
    }
    for (let i = 0; i < this.selectedCouponList.length; i++) {
      if (this.selectedCouponList[i].couponNumber) {
        this.totalPrice.discountPrice += this.selectedCouponList[
          i
        ].discountPrice;
      }
    }

    this.totalPrice.resultProdPrice =
      this.totalPrice.prodPrice - this.totalPrice.discountPrice;
  };

  @action
  apply = () => {
    this.applyCoupon = {
      applyDiscount: 0,
      applyCouponAmount: 0,
    };
    this.applyCoupon.applyDiscount = this.totalPrice.discountPrice;
    for (let i = 0; i < this.selectedCouponList.length; i++) {
      if (this.selectedCouponList[i].couponNumber) {
        this.applyCoupon.applyCouponAmount += 1;
      }
    }

    this.root.orderpayment.orderPaymentTotalInfo.couponDiscount = this.applyCoupon.applyDiscount;
    this.root.orderpayment.totalPaymentAmount();
    this.root.orderpayment.applySelectedCoupon = [...this.selectedCouponList];
    this.handleModalClose();
  };

  @action
  handleModalShow = () => {
    this.isOpen = true;
  };

  @action
  handleModalClose = () => {
    this.isOpen = false;
  };
}

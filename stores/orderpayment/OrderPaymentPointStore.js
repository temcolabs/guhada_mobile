import { observable, action } from 'mobx';
import API from 'lib/API';

const isServer = typeof window === 'undefined';

export default class OrderPaymentPointStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable usePoint = 0;
  @observable myPoint = 0;
  @observable availablePoint = 0;
  @observable dueSavePointTotal = 0;

  @action
  getAvailablePoint = () => {
    this.availablePoint = this.root.orderpayment.orderPoint.availableTotalPoint;
  };

  @action
  getMyPoint = () => {
    API.benefit.get(`/summary`).then(res => {
      let data = res.data.data;
      if (res.data.resultCode === 200) {
        this.myPoint = data.totalFreePoint + data.totalPaidPoint;
      }
    });
  };

  @action
  setUsePoint = e => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    value = Number(value);
    this.usePoint = value;
    if (value > this.availablePoint) {
      this.root.alert.showAlert({
        content: '최대 사용 가능 포인트 초과 입니다.',
      });
      this.usePoint = this.availablePoint;
    }
    this.root.orderpayment.totalPaymentAmount(this.usePoint);
    this.getDueSavePoint();
  };

  @action
  pointfullUse = () => {
    if (this.myPoint >= this.availablePoint) {
      this.usePoint = this.availablePoint;
    } else {
      this.usePoint = this.myPoint;
    }

    this.root.orderpayment.totalPaymentAmount(this.usePoint);
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
    API.benefit.post(`/process/due-save`, bundleData).then(res => {
      let data = res.data.data;
      if (res.status === 200) {
        this.dueSavePointTotal = 0;
        for (let i = 0; i < data.dueSavePointList.length; i++) {
          this.dueSavePointTotal += data.dueSavePointList[i].totalPoint;
        }
        this.dueSaveList = data.dueSavePointList;
      }
    });
  };
}

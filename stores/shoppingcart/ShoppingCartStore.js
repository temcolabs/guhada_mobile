import React from 'react';
import { observable, action } from 'mobx';
import Router from 'next/router';
import API from 'childs/lib/API';
import _ from 'lodash';
import { pushRoute } from 'childs/lib/router';
import qs from 'qs';
import { devLog } from 'childs/lib/common/devLog';
const isServer = typeof window === 'undefined';

export default class ShoppingCartStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable status = {
    pageStatus: false,
    priorityCheck: true,
    optionChangeModal: 0,
    quantityNotice: false,
  };
  @observable selectedCheck = [];
  @observable selectedCheckNumber = [];
  @observable totalAmount = {
    totalProdPrice: 0,
    totalDiscountDiffPrice: 0,
    totalShipPrice: 0,
    totalPaymentPrice: 0,
  };

  @observable cartList;
  @observable cartListOptions = [];

  @observable realTimePopularityProducts = [];

  @observable cartItemOptions = [];
  @observable selectedOptions = [];
  @observable cartChangeOptions = {
    tempOptions: [],
    realOptions: [],
    willChangeCartItemId: 0,
    willChangeQuantity: 1,
    willChangeSelectDealOptionId: 0,
    currentChangeSelectDealOption: {},
  };
  @observable selectedOptionIndex = 0;
  @observable quantityMinusBtn = '/static/icon/quantity_minus_on.png';
  @observable quantityPlusBtn = '/static/icon/quantity_plus_on.png';
  @observable cartAmount = 0;
  //--------------------- 장바구니 전체 데이터 가져오기 ---------------------
  @action
  getUserShoppingCartList = () => {
    return API.order
      .get(`/cart`)
      .then(({ data }) => {
        const cartData = data.data;
        devLog(data, '장바구니 데이터');
        this.cartList = cartData.cartItemResponseList;
        this.getOptions();
        this.setTotalItemCheckbox();
        this.getTotalResultAmount();
        this.cartAmount = this.cartList.length;
        devLog(this.cartList, 'cartList');
        this.status.pageStatus = true;

        if (this.cartList.length === 0) {
          this.getRealTimePopularityProducts();
        }

        return cartData;
      })
      .catch(err => {
        devLog(err);
        if (err.data) {
          pushRoute(
            `/login?${qs.stringify({
              redirectTo: `/shoppingcart`,
            })}`,
            { isReplace: true }
          );
        }
      });
  };

  @action
  globalGetUserShoppingCartList = () => {
    API.order
      .get(`/cart`)
      .then(res => {
        let data = res.data;
        this.cartList = data.data.cartItemResponseList;
        this.cartAmount = this.cartList.length;
        devLog(data, 'global shoppingcart length');
      })
      .catch(err => {
        console.error(err);
        this.cartAmount = 0;
      });
  };
  //--------------------- 장바구니 실시간 인기 상품 가져오기 ---------------------
  @action
  getRealTimePopularityProducts = () => {
    API.product
      .get(`/deals?division=MAIN_NEW_ARRIVALS&unitPerPage=3`)
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.realTimePopularityProducts = data.data;
          devLog(
            this.realTimePopularityProducts,
            'this.realTimePopularityProducts'
          );
        }
      })
      .catch(err => {
        devLog(err, 'err');
      });
  };

  //--------------------- 옵션수량 바뀐 장바구니 전체 데이터 가져오기 ---------------------
  @action
  getChangeShoppingCartList = () => {
    API.order.get(`/cart`).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.cartList = data.data.cartItemResponseList;
        this.getOptions();
        this.getTotalResultAmount();
      }
    });
  };

  //--------------------- 장바구니 체크박스 셋팅 ---------------------
  @action
  setTotalItemCheckbox = () => {
    this.status.priorityCheck = true;
    this.selectedCheck = this.cartList.map(data => {
      if (data.cartValidStatus.status) {
        return data.cartValidStatus.status;
      } else {
        this.status.soldOutProduct = true;
        return null;
      }
    });
    this.getTotalCheckBoxNumber();
  };

  @action
  changeTotalItemCheckboxPriority = () => {
    this.status.priorityCheck = !this.status.priorityCheck;
    if (this.status.priorityCheck) {
      for (let i = 0; i < this.selectedCheck.length; i++) {
        if (this.selectedCheck[i] !== null) {
          this.selectedCheck[i] = true;
        }
      }
    } else {
      for (let i = 0; i < this.selectedCheck.length; i++) {
        if (this.selectedCheck[i] !== null) {
          this.selectedCheck[i] = false;
        }
      }
    }

    this.getTotalCheckBoxNumber();
    this.getTotalResultAmount();
  };

  @action
  changeItemCheckbox = targetIndex => {
    this.status.priorityCheck = false;
    this.selectedCheck[targetIndex] = !this.selectedCheck[targetIndex];

    this.getTotalCheckBoxNumber();
    this.getTotalResultAmount();
  };

  getTotalCheckBoxNumber = () => {
    this.selectedCheckNumber = this.selectedCheck.filter(data => data);
  };
  //--------------------- 장바구니 토탈 계산 결과 값 ---------------------
  getTotalResultAmount = () => {
    this.totalAmount = {
      totalProdPrice: 0,
      totalDiscountDiffPrice: 0,
      totalShipPrice: 0,
      totalPaymentPrice: 0,
    };
    for (let i = 0; i < this.cartList.length; i++) {
      if (this.selectedCheck[i]) {
        this.totalAmount.totalProdPrice += this.cartList[i].sellPrice;
        this.totalAmount.totalDiscountDiffPrice += this.cartList[
          i
        ].discountDiffPrice;
        this.totalAmount.totalShipPrice += this.cartList[i].shipExpense;
      }
    }

    this.totalAmount.totalPaymentPrice =
      this.totalAmount.totalProdPrice +
      this.totalAmount.totalShipPrice -
      this.totalAmount.totalDiscountDiffPrice;
  };

  //--------------------- 장바구니리스트 아이템 옵션 추출 ---------------------
  getOptions = () => {
    let tempAttribute = '';
    let tempArray = [];
    let branchArray = [];

    this.cartList.map((data, index) => {
      tempAttribute = '';
      tempArray = [];
      for (let key in data.selectedCartOption) {
        if (key.indexOf('attribute') !== -1) {
          if (data.selectedCartOption[key] !== null) {
            tempArray.push(data.selectedCartOption[key]);
          }
        }
      }
      for (let x = 0; x < tempArray.length; x++) {
        tempAttribute += tempArray[x] + ', ';
      }
      tempAttribute = tempAttribute.substr(0, tempAttribute.length);
      if (tempAttribute === '') {
        branchArray.push(data.currentQuantity + '개');
      } else {
        branchArray.push(`${tempAttribute} ${data.currentQuantity}개`);
      }
    });
    this.cartListOptions = branchArray;
  };

  @action
  quantityChangeOutFocus = (id, e) => {
    let changeQuantity = parseInt(e.target.value);
    let tempQuantity = 0;

    this.cartList.map((data, index) => {
      if (data.cartItemId === id) {
        if (isNaN(changeQuantity)) {
          data.currentQuantity = '';
          tempQuantity = 1;
        }
      }
    });

    if (tempQuantity > 0) {
      API.order
        .post(`/cart/changeQuantity?cartItemId=${id}&quantity=${tempQuantity}`)
        .then(res => {
          let data = res.data;
          if (data.resultCode === 200) {
            this.getChangeShoppingCartList();
          }
        });
    }
  };

  //--------------------- 장바구니 옵션바꾸기 위한 옵션 목록 호출 ---------------------
  @action
  optionChangeModal = (id, quantity, cartItemId, selectDealOption) => {
    this.cartChangeOptions.willChangeQuantity = quantity;
    this.cartChangeOptions.willChangeCartItemId = cartItemId;
    this.cartChangeOptions.currentChangeSelectDealOption = selectDealOption;

    if (
      this.status.optionChangeModal === 0 ||
      this.status.optionChangeModal !== cartItemId
    ) {
      this.status.optionChangeModal = 0;

      if (!this.cartChangeOptions.currentChangeSelectDealOption) {
        this.status.optionChangeModal = cartItemId;
        for (let i = 0; i < this.cartList.length; i++) {
          if (this.cartList[i].cartItemId === cartItemId) {
            this.selectedOptions.stock = this.cartList[i].totalStock;
          }
        }
      } else {
        API.product.get(`/order-deals/${id}/options`).then(res => {
          let data = res.data;
          this.cartItemOptions = data.data;

          this.cartItemOptions.map((data, index) => {
            if (
              data.dealOptionSelectId === selectDealOption.dealOptionSelectId
            ) {
              this.selectedOptionIndex = index;
              this.selectedOptions = data;
              this.cartChangeOptions.willChangeSelectDealOptionId =
                selectDealOption.dealOptionSelectId;
            }
          });

          this.getChageItemOptionsLabel();

          this.status.optionChangeModal = cartItemId;
        });
      }
    } else if (this.status.optionChangeModal === cartItemId) {
      this.status.optionChangeModal = 0;
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
  //--------------------- 장바구니 옵션 변경할 데이터 라벨 값 추출 ---------------------
  getChageItemOptionsLabel = () => {
    let tempAttribute = '';
    let tempArray = [];
    this.cartChangeOptions.tempOptions = [];
    this.cartChangeOptions.realOptions = [];

    for (let i = 0; i < this.cartItemOptions.length; i++) {
      tempAttribute = '';
      tempArray = [];
      for (let key in this.cartItemOptions[i]) {
        if (key.indexOf('attribute') !== -1) {
          tempArray.push(this.cartItemOptions[i][key]);
        }
      }
      for (let x = 0; x < tempArray.length; x++) {
        tempAttribute += tempArray[x] + ' ';
      }

      tempAttribute = tempAttribute.substr(0, tempAttribute.length);
      this.cartChangeOptions.tempOptions.push({
        label:
          this.cartItemOptions[i].stock === 0
            ? `${tempAttribute} (품절)`
            : this.cartItemOptions[i].price === 0
            ? tempAttribute
            : this.cartItemOptions[i].price > 0
            ? `${tempAttribute} (+${this.cartItemOptions[
                i
              ].price.toLocaleString()}원)`
            : `${tempAttribute} (-${this.cartItemOptions[
                i
              ].price.toLocaleString()}원)`,

        icon: '',
        stock: this.cartItemOptions[i].stock,
        price: this.cartItemOptions[i].price,
        id: this.cartItemOptions[i].dealOptionSelectId,
        color: this.cartItemOptions[i].rgb1,
        isDisabled: this.cartItemOptions[i].stock <= 0 ? true : false,
      });
      this.cartChangeOptions.realOptions = this.cartChangeOptions.tempOptions;
    }
  };

  //--------------------- 수량변경 ---------------------
  @action
  quantityChange = (id, e) => {
    let changeQuantity = parseInt(e.target.value);
    if (isNaN(changeQuantity)) {
      this.cartChangeOptions.willChangeQuantity = '';
      return false;
    } else if (changeQuantity > this.selectedOptions.stock) {
      this.root.alert.showAlert({
        content: '재고수량 초과',
      });
      this.cartChangeOptions.willChangeQuantity = this.selectedOptions.stock;
      return false;
    } else if (changeQuantity < 0) {
      return false;
    } else {
      if (changeQuantity === 0) {
        this.cartChangeOptions.willChangeQuantity = 1;
        return false;
      }

      this.cartChangeOptions.willChangeQuantity = changeQuantity;
    }
  };

  @action
  quantityMinus = () => {
    if (this.cartChangeOptions.willChangeQuantity <= 1) {
      this.cartChangeOptions.willChangeQuantity = 1;
      this.status.quantityNotice = true;
      return false;
    }

    this.cartChangeOptions.willChangeQuantity =
      this.cartChangeOptions.willChangeQuantity - 1;
  };

  @action
  quantityPlus = () => {
    if (
      this.cartChangeOptions.willChangeQuantity >= this.selectedOptions.stock
    ) {
      this.root.alert.showAlert({
        content: '재고수량 초과',
      });
      return false;
    }
    this.status.quantityNotice = false;
    this.cartChangeOptions.willChangeQuantity =
      this.cartChangeOptions.willChangeQuantity + 1;
  };

  //--------------------- 장바구니 옵션 변경할 옵션 아이디 값 바인딩 ---------------------
  @action
  setChangeItemData = value => {
    let currentDealOptionId = this.cartChangeOptions
      .currentChangeSelectDealOption.dealOptionSelectId;
    if (value.id === currentDealOptionId) {
      this.root.alert.showAlert({
        content: '이미 선택된 옵션입니다.',
      });
      this.cartChangeOptions.willChangeSelectDealOptionId = 0;
      this.shoppingCartModalClose();
    } else {
      this.selectedOptions = value;
      this.cartChangeOptions.willChangeSelectDealOptionId = value.id;
      this.cartChangeOptions.willChangeQuantity = 1;
    }
  };

  //--------------------- 장바구니 옵션 변경 ---------------------
  @action
  optionChange = () => {
    if (!this.cartChangeOptions.currentChangeSelectDealOption) {
      API.order
        .post(
          `/cart/changeQuantity?cartItemId=${
            this.cartChangeOptions.willChangeCartItemId
          }&quantity=${this.cartChangeOptions.willChangeQuantity}`
        )
        .then(res => {
          this.getChangeShoppingCartList();
          this.shoppingCartModalClose();
        });
    } else {
      if (this.cartChangeOptions.willChangeSelectDealOptionId !== 0) {
        API.order
          .post(
            `/cart/changeSelectOption?cartItemId=${
              this.cartChangeOptions.willChangeCartItemId
            }&quantity=${
              this.cartChangeOptions.willChangeQuantity
            }&selectDealOptionId=${
              this.cartChangeOptions.willChangeSelectDealOptionId
            }`
          )
          .then(res => {
            let data = res.data;
            this.getChangeShoppingCartList();
            this.shoppingCartModalClose();
          });
      } else {
        this.root.alert.showAlert({
          content: '선택된 옵션이 없습니다.',
        });
      }
    }
  };
  //--------------------- 옵션 변경 모달 닫기 ---------------------
  @action
  shoppingCartModalClose = () => {
    this.status.optionChangeModal = 0;
  };

  //--------------------- 장바구니 아이템 삭제하기 ---------------------
  @action
  ShoppingCartItemDelete = id => {
    this.root.alert.showConfirm({
      content: '해당 상품을 삭제하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => {
        this.unSoldDeleteApiCall(id);
      },
    });
  };

  //--------------------- 장바구니 선택한 아이템 삭제하기 ---------------------
  @action
  selectedDelete = () => {
    let selectIdList = [];

    for (let i = 0; i < this.selectedCheck.length; i++) {
      if (this.selectedCheck[i]) {
        selectIdList.push(this.cartList[i].cartItemId);
      }
    }

    if (selectIdList.length > 0) {
      this.root.alert.showConfirm({
        content: '선택 상품을 삭제하시겠습니까?',
        confirmText: '확인',
        cancelText: '취소',
        onConfirm: () => {
          this.unSoldDeleteApiCall(selectIdList);
        },
      });
    } else {
      this.root.alert.showAlert({
        content: '선택 상품이 없습니다.',
      });
    }
  };

  //--------------------- 장바구니 품절/판매종료 상품 전체삭제 ---------------------
  @action
  unSoldDelete = () => {
    let selectIdList = [];
    for (let i = 0; i < this.selectedCheck.length; i++) {
      if (this.selectedCheck[i] === null) {
        selectIdList.push(this.cartList[i].cartItemId);
      }
    }

    if (selectIdList.length > 0) {
      this.root.alert.showConfirm({
        content: '판매종료 상품을 삭제하시겠습니까?',
        confirmText: '확인',
        cancelText: '취소',
        onConfirm: () => {
          this.unSoldDeleteApiCall(selectIdList);
        },
      });
    } else {
      this.root.alert.showAlert({
        content: '해당 상품이 없습니다.',
      });
    }
  };

  unSoldDeleteApiCall = selectIdList => {
    API.order
      .post(`/cart/removeCartItem?cartItemIdList=${selectIdList}`)
      .then(res => {
        this.getUserShoppingCartList();
        this.globalGetUserShoppingCartList();
      });
  };
  //--------------------- 장바구니 아이템 즉시구매하기 ---------------------
  @action
  shoppingCartimmediatePurchase = (e, id) => {
    e.stopPropagation();
    Router.push({
      pathname: '/orderpayment',
      query: {
        cartList: id,
      },
    });
  };

  //--------------------- 장바구니 선택아이템 구매하기 ---------------------
  @action
  selectedItemOrder = () => {
    let selectIdList = '';
    this.selectedCheck.map((data, index) => {
      if (data) {
        selectIdList += this.cartList[index].cartItemId + ',';
      }
    });

    if (selectIdList !== ' ') {
      Router.push({
        pathname: '/orderpayment',
        query: {
          cartList: selectIdList,
        },
      });
    } else {
      this.root.alert.showAlert({
        content: '선택 상품이 없습니다.',
      });
    }
  };

  @action
  goLike = () => {
    this.root.alert.showAlert({
      content: 'PC/앱 버전에서 사용가능합니다.',
    });
  };
}

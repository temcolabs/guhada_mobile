import { observable, action, toJS, extendObservable } from 'mobx';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { componentByNodeRegistery } from 'mobx-react';
const isServer = typeof window === 'undefined';
import API from 'lib/API';

export default class ShoppingCartStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable status = {
    pageStatus: false,
    priorityCheck: true,
    optionChangeModal: false,
  };
  @observable selectedCheck = [];
  @observable totalAmount = {
    totalProdPrice: 0,
    totalDiscountDiffPrice: 0,
    totalShipPrice: 0,
    totalPaymentPrice: 0,
  };

  @observable cartList;
  @observable cartListOptions = [];

  @observable cartItemOptions = [];
  @observable cartChangeOptions = {
    tempOptions: [],
    realOptions: [],
    willChangeCartItemId: 0,
    willChangeQuantity: 1,
    willChangeSelectDealOptionId: 0,
    currentChangeSelectDealOptionId: 0,
  };

  @observable quantityMinusBtn = '/static/icon/quantity_minus_off.png';
  @observable quantityPlusBtn = '/static/icon/quantity_plus_on.png';

  //--------------------- 장바구니 전체 데이터 가져오기 ---------------------
  @action
  getUserShoppingCartList = () => {
    API.order.get(`/cart`).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.cartList = data.data.cartItemResponseList;
        this.getOptions();
        this.setTotalItemCheckbox();
        this.getTotalResultAmount();
        console.log(this.cartList, 'cartList');
        this.status.pageStatus = true;
      }
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
        this.setTotalItemCheckbox();
      }
    });
  };

  //--------------------- 장바구니 체크박스 셋팅 ---------------------
  @action
  setTotalItemCheckbox = () => {
    this.selectedCheck = [];

    this.cartList.map(data => {
      if (data.cartValidStatus.status) {
        this.selectedCheck.push({ check: true });
      } else {
        this.selectedCheck.push({ unSold: true });
      }
    });
  };

  @action
  changeTotalItemCheckboxPriority = () => {
    this.status.priorityCheck = !this.status.priorityCheck;

    if (this.status.priorityCheck) {
      this.selectedCheck.map(data => {
        if (!data.unSold) {
          data.check = true;
        }
      });
    } else {
      this.selectedCheck.map(data => {
        if (!data.unSold) {
          data.check = false;
        }
      });
    }

    this.getTotalResultAmount();
  };

  @action
  changeItemCheckbox = targetIndex => {
    this.status.priorityCheck = false;
    this.selectedCheck[targetIndex].check = !this.selectedCheck[targetIndex]
      .check;

    this.getTotalResultAmount();
  };

  //--------------------- 장바구니 토탈 계산 결과 값 ---------------------
  getTotalResultAmount = () => {
    this.totalAmount = {
      totalProdPrice: 0,
      totalDiscountDiffPrice: 0,
      totalShipPrice: 0,
      totalPaymentPrice: 0,
    };
    this.cartList.map((data, index) => {
      if (this.selectedCheck[index].check) {
        this.totalAmount.totalProdPrice += data.discountPrice;
        this.totalAmount.totalDiscountDiffPrice += data.discountDiffPrice;
        this.totalAmount.totalShipPrice += data.shipExpense;
      }
    });
    this.totalAmount.totalPaymentPrice =
      this.totalAmount.totalProdPrice -
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
        tempAttribute += tempArray[x] + '/';
      }
      tempAttribute = tempAttribute.substr(0, tempAttribute.length - 1);
      if (tempAttribute == '') {
        branchArray.push('옵션없는상품/' + data.currentQuantity + '개');
      } else {
        branchArray.push(tempAttribute + '/' + data.currentQuantity + '개');
      }
    });
    this.cartListOptions = branchArray;
  };

  @action
  quantityMinus = id => {
    let tempQuantity = 0;
    let targetIndex = 0;
    this.cartList.map((data, index) => {
      if (data.cartItemId === id) {
        tempQuantity = data.currentQuantity - 1;
        targetIndex = index;
      }
    });

    if (tempQuantity <= 0) {
      this.root.alert.showAlert({
        content: '1개 이상 선택해주세요!',
      });
      return false;
    } else {
      API.order
        .post(`/cart/changeQuantity?cartItemId=${id}&quantity=${tempQuantity}`)
        .then(res => {
          let data = res.data;
          if (data.resultCode === 200) {
            // this.cartList[targetIndex].currentQuantity = tempQuantity;
            this.getChangeShoppingCartList();
          }
        });
    }
  };

  @action
  quantityPlus = id => {
    let tempQuantity = 0;
    let targetIndex = 0;
    let currentStock;
    this.cartList.map((data, index) => {
      if (data.cartItemId === id) {
        data.selectedCartOption
          ? (currentStock = data.selectedCartOption.stock)
          : (currentStock = data.totalStock);
        if (currentStock === data.currentQuantity) {
          this.root.alert.showAlert({
            content: `재고수량 ${currentStock} 개 초과 `,
          });
          return false;
        } else {
          tempQuantity = data.currentQuantity + 1;
          targetIndex = index;
        }
      }
    });
    if (tempQuantity > 0) {
      API.order
        .post(`/cart/changeQuantity?cartItemId=${id}&quantity=${tempQuantity}`)
        .then(res => {
          let data = res.data;
          if (data.resultCode === 200) {
            // this.cartList[targetIndex].currentQuantity = tempQuantity;
            this.getChangeShoppingCartList();
          }
        });
    }
  };

  //--------------------- 수량변경 ---------------------
  @action
  quantityChange = (id, e) => {
    let tempQuantity = 0;
    let changeQuantity = parseInt(e.target.value);
    let targetIndex = 0;
    let currentStock;
    this.cartList.map((data, index) => {
      if (data.cartItemId === id) {
        data.selectedCartOption
          ? (currentStock = data.selectedCartOption.stock)
          : (currentStock = data.totalStock);
        if (isNaN(changeQuantity)) {
          data.currentQuantity = '';
          return false;
        } else if (changeQuantity > currentStock) {
          this.root.alert.showAlert({
            content: `재고수량 ${currentStock} 개 초과 `,
          });
          tempQuantity = currentStock;
        } else if (changeQuantity <= 0) {
          this.root.alert.showAlert({
            content: '1개 이상 구매',
          });
          return false;
        } else {
          data.currentQuantity = changeQuantity;
          tempQuantity = changeQuantity;
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

  //--------------------- 장바구니 옵션바꾸는 모달 ---------------------
  @action
  optionChangeModal = (id, quantity, cartItemId, selectDealOptionId) => {
    this.cartChangeOptions.willChangeQuantity = quantity;
    this.cartChangeOptions.willChangeCartItemId = cartItemId;
    this.cartChangeOptions.currentChangeSelectDealOptionId = selectDealOptionId;

    API.product.get(`/order-deals/${id}/options`).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.cartItemOptions = data.data;
        console.log(this.cartItemOptions, 'this.cartItemOptions');
        this.getChageItemOptionsLabel();

        this.status.optionChangeModal = !this.status.optionChangeModal;
      }
    });
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
        tempAttribute += tempArray[x] + ' / ';
      }

      tempAttribute = tempAttribute.substr(0, tempAttribute.length - 3);
      this.cartChangeOptions.tempOptions.push({
        label:
          this.cartItemOptions[i].stock === 0
            ? tempAttribute + '\u00A0(품절)'
            : tempAttribute +
              '\u00A0 (' +
              this.cartItemOptions[i].price.toLocaleString() +
              ' 원)',
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

  //--------------------- 장바구니 옵션 변경할 옵션 아이디 값 바인딩 ---------------------
  @action
  setChangeItemData = value => {
    let currentDealOptionId = this.cartChangeOptions
      .currentChangeSelectDealOptionId;
    if (value.id === currentDealOptionId) {
      this.root.alert.showAlert({
        content: '이미 선택된 옵션입니다.',
      });
      this.cartChangeOptions.willChangeSelectDealOptionId = 0;
      this.shoppingCartModalClose();
    } else {
      this.cartChangeOptions.willChangeSelectDealOptionId = value.id;
    }
  };

  //--------------------- 장바구니 옵션 변경 ---------------------
  @action
  optionChange = () => {
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
          if (data.resultCode === 200) {
            this.getChangeShoppingCartList();
            this.shoppingCartModalClose();
          }
        });
    } else {
      this.root.alert.showAlert({
        content: '선택된 옵션이 없습니다.',
      });
    }
  };
  //--------------------- 옵션 변경 모달 닫기 ---------------------
  @action
  shoppingCartModalClose = () => {
    this.status.optionChangeModal = false;
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
    this.selectedCheck.map((data, index) => {
      if (data.check) {
        selectIdList.push(this.cartList[index].cartItemId);
      }
    });

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
    this.selectedCheck.map((data, index) => {
      if (data.unSold) {
        selectIdList.push(this.cartList[index].cartItemId);
      }
    });

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
        if (res.data.resultCode === 200) {
          this.getUserShoppingCartList();
        }
      });
  };
  //--------------------- 장바구니 아이템 즉시구매하기 ---------------------
  @action
  ShoppingCartimmediatePurchase = id => {
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
    let selectIdList = ' ';
    this.selectedCheck.map((data, index) => {
      if (data.check) {
        selectIdList += this.cartList[index].cartItemId + ',';
      }
    });

    if (selectIdList !== ' ') {
      console.log(selectIdList);

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
}

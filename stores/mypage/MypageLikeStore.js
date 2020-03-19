import { observable, action } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { loginStatus } from 'childs/lib/constant';
import Router from 'next/router';
import React from 'react';
import _ from 'lodash';
import { devLog } from 'childs/lib/common/devLog';
import orderService from 'childs/lib/API/order/orderService';
export default class MypageLikeStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable likeProductList = [];

  @observable totalItemsCount = 0;
  @observable itemsCountPerPage = 20;
  @observable pageNo = 1;
  @observable pageStatus = false;
  @observable optionModalShoppingCart = false;
  @observable optionModalPurchase = false;
  @observable quantityMinusBtn = '/static/icon/quantity_minus_off.png';
  @observable quantityPlusBtn = '/static/icon/quantity_plus_on.png';
  @observable selectedOption = null;
  @observable selectedQuantity = 1;
  @observable selectedTotalPrice = 0;
  @observable selectedOptionPrice = 0;
  @observable likeItemTempOptions = [];
  @observable likeItemRealOptions = [];
  @observable likeOptionModalItem = {};

  @observable associatedProduct = [];
  @observable shoppingCartSuccess = false;
  @observable reverseList = false;
  @action
  getLikeList = ({ pageNo = 1 }) => {
    devLog(pageNo, 'pageNopageNo');
    API.gateway
      .get(
        `/my-page/bookmark-products?size=${
          this.itemsCountPerPage
        }&page=${pageNo}&target=PRODUCT`
      )
      .then(res => {
        this.likeProductList = [];
        this.pageNo = pageNo;
        this.likeProductList = res.data.data.deals;
        this.totalItemsCount = res.data.data.totalElements;
        this.itemsCountPerPage = this.itemsCountPerPage;

        this.pageStatus = true;

        devLog(this.likeProductList, '찜한상품 리스트');
      })
      .catch(err => {
        console.log(err);
        this.likeProductList = [];
        this.totalItemsCount = 0;
        this.itemsCountPerPage = this.itemsCountPerPage;
      });
  };

  @action
  modalShoppingCart = (e, dealId, target) => {
    e.stopPropagation();

    this.likeModalOpen(dealId, target);
  };

  @action
  modalImmediatePurchase = (e, dealId) => {
    e.stopPropagation();
    API.product
      .get(`/order-deals/${dealId}/options`)
      .then(res => {
        let data = res.data;
        this.likeItemTempOptions = data.data;
        this.getLikeProductModalItem(dealId);
        this.getLikeProductOption();

        this.immediatePurchaseApiCall();
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || err.message}`,
        // });
      });
  };

  likeModalOpen = (dealId, type) => {
    API.product
      .get(`/order-deals/${dealId}/options`)
      .then(res => {
        let data = res.data;
        this.likeItemTempOptions = data.data;
        this.getLikeProductModalItem(dealId);
        this.getLikeProductOption();
        devLog(this.likeItemTempOptions, ' this.likeItemTempOptions');
        if (type === 'shoppingcart') {
          this.optionModalShoppingCart = true;
        } else {
          this.optionModalPurchase = true;
        }
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || err.message}`,
        // });
      });
  };

  getLikeProductModalItem = dealId => {
    for (let i = 0; i < this.likeProductList.length; i++) {
      if (this.likeProductList[i].dealId === dealId) {
        this.likeOptionModalItem = { ...this.likeProductList[i] };
      }
    }

    this.selectedTotalPrice = this.likeOptionModalItem.discountPrice.toLocaleString();
  };

  getLikeProductOption = () => {
    let tempAttribute = '';
    let tempArray = [];
    let tempOptions = [];
    let options = this.likeItemTempOptions;
    tempOptions = [
      // {
      //   label: '선택안함',
      //   value: null,
      //   icon: null,
      // },
    ];

    if (options.length) {
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

        tempOptions.push({
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
      this.likeItemRealOptions = tempOptions;
    } else {
      this.selectedOption = {
        stock: this.likeOptionModalItem.totalStock,
        id: '',
        price: 0,
      };
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
                width: 24,
                height: 24,
                backgroundColor: color,
                border: '1px solid #ddd',
                borderRadius: '50%',
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
              height: 26,
              lineHeight: '26px',
            }}
          >
            {label}
          </div>
        </div>
      </div>
    );
  };

  @action
  selectOption = value => {
    if (value.label === '선택안함') {
      this.selectedOption = null;
      this.selectedOptionPrice = 0;
      this.selectedQuantity = 1;
      this.selectedTotalPrice = this.likeOptionModalItem.discountPrice.toLocaleString();
      return false;
    }

    if (this.selectedOption) {
      if (this.selectedOption.id !== value.id) {
        this.selectedOption = value;
        this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
        this.selectedQuantity = 1;
        this.getTotalPrice();
      }
    } else {
      this.selectedOption = value;
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
      this.selectedQuantity = 1;
      this.getTotalPrice();
    }
  };

  getTotalPrice = () => {
    this.selectedTotalPrice = (
      this.likeOptionModalItem.discountPrice * this.selectedQuantity +
      this.selectedOption.price * this.selectedQuantity
    ).toLocaleString();

    if (this.likeItemRealOptions.length === 0) {
      this.selectedOptionPrice = 0;
    } else {
      this.selectedOptionPrice =
        this.selectedOption.price * this.selectedQuantity;
    }
  };

  @action
  quantityMinusHoverOn = () => {
    this.quantityMinusBtn = '/static/icon/quantity_minus_on.png';
  };

  @action
  quantityMinusHoverOut = () => {
    this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
  };

  @action
  quantityPlusHoverOn = () => {
    this.quantityPlusBtn = '/static/icon/quantity_plus_on.png';
  };

  @action
  quantityPlusHoverOut = () => {
    this.quantityPlusBtn = '/static/icon/quantity_plus_off.png';
  };

  @action
  quantityMinus = () => {
    if (!this.selectedOption) {
      this.root.alert.showAlert({
        content: '옵션을 먼저 선택해주세요',
        confirmText: '확인',
      });
      return false;
    }
    if (this.selectedQuantity <= 1) {
      this.selectedQuantity = 1;
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
      return false;
    }

    if (this.selectedQuantity === 2) {
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
    }

    this.quantityPlusBtn = '/static/icon/quantity_plus_on.png';
    this.selectedQuantity = this.selectedQuantity - 1;
    this.getTotalPrice();
  };

  @action
  quantityPlus = () => {
    if (!this.selectedOption) {
      this.root.alert.showAlert({
        content: '옵션을 먼저 선택해 주세요.',
        confirmText: '확인',
      });
      return false;
    }
    if (this.selectedQuantity >= this.selectedOption.stock) {
      this.root.alert.showAlert({
        content: '재고수량 초과',
        confirmText: '확인',
      });
      return false;
    }
    if (this.selectedQuantity === this.selectedOption.stock - 1) {
      this.quantityPlusBtn = '/static/icon/quantity_plus_off.png';
    }
    this.quantityMinusBtn = '/static/icon/quantity_minus_on.png';
    this.selectedQuantity = this.selectedQuantity + 1;

    this.getTotalPrice();
  };

  @action
  quantityChange = e => {
    let value = e.target.value;
    value = parseInt(value);
    if (isNaN(value)) {
      this.selectedQuantity = '';
      return false;
    } else if (value > this.selectedOption.stock) {
      this.root.alert.showAlert({
        content: '재고수량 초과',
        confirmText: '확인',
      });
      this.selectedQuantity = this.selectedOption.stock;
      this.getTotalPrice();
      this.quantityPlusBtn = '/static/icon/quantity_plus_off.png';
      this.quantityMinusBtn = '/static/icon/quantity_minus_on.png';
      return false;
    } else if (value < 0) {
      return false;
    } else {
      if (value === 0) {
        this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
        this.selectedQuantity = 1;
        this.getTotalPrice();
        return false;
      }
      value === this.selectedOption.stock
        ? (this.quantityPlusBtn = '/static/icon/quantity_plus_off.png')
        : (this.quantityPlusBtn = '/static/icon/quantity_plus_on.png');

      this.quantityMinusBtn = '/static/icon/quantity_minus_on.png';
      this.selectedQuantity = value;
      this.getTotalPrice();
    }
  };

  @action
  quantityChangeOutFocus = e => {
    let value = e.target.value;
    value = parseInt(value);
    if (isNaN(value) || value <= 0) {
      this.quantityMinusBtn = '/static/icon/quantity_minus_off.png';
      this.quantityPlusBtn = '/static/icon/quantity_plus_on.png';
      this.selectedQuantity = 1;
      this.getTotalPrice();
    }
  };

  @action
  likeSortChange = sort => {
    if (sort.value === 'ASC') {
      this.reverseList = true;
    } else {
      this.reverseList = false;
    }
  };

  @action
  optionDataActive = () => {
    if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
      if (this.selectedOption) {
        if (this.optionModalShoppingCart) {
          this.shoppingCartApiCall();
        } else if (this.optionModalPurchase) {
          this.immediatePurchaseApiCall();
        }
      } else {
        this.root.alert.showAlert({
          content: '옵션을 선택 해주세요.',
          confirmText: '확인',
        });
      }
    } else {
      this.root.alert.showAlert({
        content: '로그인 을 해주세요.',
        confirmText: '확인',
      });
    }
  };

  shoppingCartApiCall = () => {
    orderService
      .addShoppingCart({
        dealId: this.likeOptionModalItem.dealId,
        dealOptionId: this.selectedOption.id,
        quantity: this.selectedQuantity,
      })
      .then(res => {
        this.root.shoppingcart.globalGetUserShoppingCartList();
        API.product
          .get(
            `/deals?brandId=${
              this.likeOptionModalItem.brandId
            }&pageIndex=0&unitPerPage=3`
          )
          .then(res => {
            let data = res.data;
            this.optionModalClose();

            this.root.associatedProductModal.associatedProduct = data.data;
            this.root.associatedProductModal.shoppingCartSuccess = true;
          });
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || err.message}`,
        // });
      });
  };

  immediatePurchaseApiCall = () => {
    orderService
      .addShoppingCart({
        dealId: this.likeOptionModalItem.dealId,
        dealOptionId: this.selectedOption.id,
        quantity: this.selectedQuantity,
      })
      .then(res => {
        this.root.shoppingcart.globalGetUserShoppingCartList();
        let data = res.data;
        Router.push({
          pathname: '/orderpayment',
          query: {
            cartList: data.data.cartItemId,
          },
        });
        this.optionModalClose();
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || err.message}`,
        // });
      });
  };

  @action
  optionModalClose = () => {
    this.optionModalShoppingCart = false;
    this.optionModalPurchase = false;

    this.selectedOption = null;
    this.selectedOptionPrice = 0;
    this.selectedQuantity = 1;
    this.likeItemRealOptions = [];
  };

  @action
  likeItemDelete = (e, id) => {
    e.stopPropagation();

    this.likeItemDeleteApiCall(id);
  };

  likeItemDeleteApiCall = id => {
    API.user
      .delete(`/users/bookmarks?target=PRODUCT&targetId=${id}`)
      .then(res => {
        this.root.alert.showAlert({
          content: '해당상품이 삭제 되었습니다.',
          confirmText: '확인',
        });

        let temp = this.likeProductList;

        temp = this.likeProductList.filter((item, idx) => {
          return item.productId !== id;
        });

        this.likeProductList = temp;
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
        // });
      });
  };

  @action
  goProduct = id => {
    Router.push(`/productdetail?deals=${id}`);
  };

  @action
  totalDelete = () => {
    API.user
      .delete(`/users/bookmarks?target=PRODUCT`)
      .then(res => {
        this.root.alert.showAlert({
          content: '전체삭제 되었습니다.',
          confirmText: '확인',
        });

        this.likeProductList = [];
      })
      .catch(err => {
        console.log(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || 'ERROR'}`,
        // });
        this.likeProductList = [];
      });
  };
}

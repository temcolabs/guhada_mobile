import React from 'react';
import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import localStorage from 'childs/lib/common/localStorage';
import key from 'childs/lib/constant/key';
import _ from 'lodash';
import { loginStatus } from 'childs/lib/constant';
import API from 'childs/lib/API';
import Router from 'next/router';
import { devLog } from 'childs/lib/common/devLog';
import orderService from 'childs/lib/API/order/orderService';
export default class MypageRecentlySeenStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
      this.MAX_ITEM = 20;
    }
  }

  @observable list = [];
  @observable totalItemsCount = 0;

  @observable optionModalShoppingCart = false;
  @observable optionModalPurchase = false;
  @observable quantityMinusBtn = '/static/icon/quantity_minus_off.png';
  @observable quantityPlusBtn = '/static/icon/quantity_plus_on.png';
  @observable selectedOption = null;
  @observable selectedQuantity = 1;
  @observable selectedTotalPrice = 0;
  @observable selectedOptionPrice = 0;
  @observable recentlySeenItemTempOptions = [];
  @observable likeItemRealOptions = [];
  @observable recentlySeenOptionModalItem = {};

  @observable associatedProduct = [];
  @observable shoppingCartSuccess = false;

  /**
   * 로컬 스토리지에서 리스트를 가져와 초기화한다
   */
  @action
  init = () => {
    const storageList = this.getListFromStorage();
    this.list = storageList || [];
    this.totalItemsCount = this.list.length;

    devLog(toJS(this.list), `thislist`);
  };

  @action
  getListFromStorage = () => {
    return localStorage.get(key.PRODUCT_RECENTLY_SEEN);
  };

  /**
   * 최근 본 상품 추가. deals 객체 전체를 그대로 저장.
   * 아이디가 중복이면 추가되지 않는다
   * 최대 개수 제한 있음
   *
   * @param {object} deals 상품 상세정보
   */
  @action
  addItem = (deals = {}) => {
    if (_.isNil(deals.dealsId)) {
      console.error('[addItem] dealsId가 없습니다.');
    } else {
      const isDuplicate =
        this.list.findIndex(item => item.dealsId === deals.dealsId) > -1;

      if (!isDuplicate) {
        const listItem = Object.assign({}, toJS(deals));
        this.list.splice(0, 0, listItem); // 맨 앞부터 추가
        this.list = this.list.slice(0, this.MAX_ITEM); // 최대 개수 조절

        localStorage.set(key.PRODUCT_RECENTLY_SEEN, toJS(this.list));
      }
    }
  };

  /**
   * 목록에서 전달된 아이디에 매칭되는 아이템 삭제
   */
  @action
  removeItem = (e, dealsId = '') => {
    e.stopPropagation();
    const targetIndex = this.list.findIndex(item => item.dealsId === dealsId);

    if (targetIndex > -1) {
      this.list.splice(targetIndex, 1);
      localStorage.set(key.PRODUCT_RECENTLY_SEEN, toJS(this.list));
      this.totalItemsCount = this.list.length;

      this.root.alert.showAlert({
        content: '최근 본 상품이 삭제 되었습니다.',
      });
    }
  };

  /**
   * 최근본 상품 전체 삭제
   */
  @action
  removeItemAll = () => {
    this.root.alert.showConfirm({
      content: '최근 본 상품을 모두 삭제하시겠습니까 ?',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => {
        this.removeItemAllConfirm();
      },
    });
  };

  removeItemAllConfirm = () => {
    this.list = [];
    localStorage.remove(key.PRODUCT_RECENTLY_SEEN);
    this.totalItemsCount = 0;

    this.root.alert.showAlert({
      content: '최근 본 상품이 모두 삭제 되었습니다.',
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
        this.recentlySeenItemTempOptions = data.data;
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
        this.recentlySeenItemTempOptions = data.data;
        this.getLikeProductModalItem(dealId);
        this.getLikeProductOption();

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
    this.list.forEach(data => {
      if (data.dealsId === dealId) {
        this.recentlySeenOptionModalItem = { ...data };
      }
    });
    this.selectedTotalPrice = this.recentlySeenOptionModalItem.discountPrice.toLocaleString();
  };

  getLikeProductOption = () => {
    let tempAttribute = '';
    let tempArray = [];
    let options = this.recentlySeenItemTempOptions;
    this.recentlySeenItemTempOptions = [
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

        this.recentlySeenItemTempOptions.push({
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
      this.likeItemRealOptions = this.recentlySeenItemTempOptions;
    } else {
      this.selectedOption = {
        stock: this.recentlySeenOptionModalItem.totalStock,
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
      this.selectedTotalPrice = this.recentlySeenOptionModalItem.discountPrice.toLocaleString();
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
      this.recentlySeenOptionModalItem.discountPrice * this.selectedQuantity +
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
        dealId: this.recentlySeenOptionModalItem.dealsId,
        dealOptionId: this.selectedOption.id,
        quantity: this.selectedQuantity,
      })
      .then(() => {
        this.root.shoppingcart.getUserShoppingCartList();
        API.product
          .get(
            `/deals?brandId=${
              this.recentlySeenOptionModalItem.brandId
            }&pageIndex=0&unitPerPage=3`
          )
          .then(res => {
            let data = res.data;
            this.optionModalClose();

            this.root.associatedProductModal.associatedProduct = data.data;
            this.root.associatedProductModal.shoppingCartSuccess = true;
          })
          .catch(err => {
            console.log(err);
            // this.root.alert.showAlert({
            //   content: `${_.get(err, 'data.message') || err.message}`,
            // });
          });
      });
  };

  immediatePurchaseApiCall = () => {
    orderService
      .addShoppingCart({
        dealId: this.recentlySeenOptionModalItem.dealsId,
        dealOptionId: this.selectedOption.id,
        quantity: this.selectedQuantity,
      })
      .then(res => {
        this.root.shoppingcart.getUserShoppingCartList();
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
  goProduct = id => {
    Router.push(`/productdetail?deals=${id}`);
  };
}

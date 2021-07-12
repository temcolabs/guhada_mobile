import { observable, action, toJS } from 'mobx';
import { loginStatus } from 'lib/constant';
import API from 'lib/API';
import Router from 'next/router';
import { sendBackToLogin, pushRoute } from 'lib/router';
import qs from 'qs';
import naverShoppingTrakers from 'lib/tracking/navershopping/naverShoppingTrakers';
import daumTracker from 'lib/tracking/daum/daumTracker';
import criteoTracker from 'lib/tracking/criteo/criteoTracker';
import kochavaTracker from 'lib/tracking/kochava/kochavaTracker';
import _ from 'lodash';
import ReactPixel from 'react-facebook-pixel';
const isServer = typeof window === 'undefined';

export default class CartAndPurchaseStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable associatedProduct = [];
  @observable addCartStatus = false;
  @observable isProductOptionModal = false;

  @action
  addShoppingCart = () => {
    let options = this.root.productoption.options;
    if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
      if (options.selectedOption) {
        this.addCartStatus = true;
        API.order
          .post(
            `/cart/addCartItem`,
            qs.stringify({
              dealId: this.root.productdetail.deals.dealsId,
              dealOptionId: options.selectedOption.id,
              quantity: options.selectedQuantity,
            }),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
            }
          )
          .then((res) => {
            API.product
              .get(
                `/deals`,
                qs.stringify({
                  brandId: this.root.productdetail.deals.brandId,
                  pageIndex: 0,
                  unitPerPage: 3,
                }),
                {
                  headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                  },
                }
              )
              .then((res) => {
                let data = res.data;
                this.associatedProduct = data.data;
                this.root.shoppingCartSuccessModal.showModal({
                  confirmText: '장바구니로 이동',
                  contentStyle: {
                    position: 'fixed',
                    width: '100%',
                    bottom: '0%',
                    top: 'none',
                    left: '50%',
                    right: 'initial',
                    transform: 'translate(-50%, 0%)',
                    background: 'transparent',
                    padding: 0,
                    overflow: 'hidden',
                    borderRadius: 0,
                  },
                  onConfirm: () => {
                    pushRoute('/shoppingcart');
                  },
                });
                this.addCartStatus = false;
                this.isProductOptionModal = false;
              })
              .catch(() => {
                this.addCartStatus = false;
                this.isProductOptionModal = false;
              });

            this.root.shoppingcart.globalGetUserShoppingCartList();

            // 카트에 추가된 상품.
            const dealAddedToCart = _.get(res, 'data.data');
            const { discountPrice, sellPrice } = dealAddedToCart;

            // 트래커 연결
            naverShoppingTrakers.shoppingCart();
            daumTracker.shoppingCart();
            criteoTracker.addDealToCart({
              email: this.root.user?.userInfo?.email,
              items: [
                {
                  id: this.root.productdetail.deals.dealsId,
                  price: discountPrice || sellPrice,
                  quantity: options.selectedQuantity,
                },
              ],
            });
            kochavaTracker.shoppingCart({
              dealId: this.root.productdetail.deals.dealsId,
              productId: this.root.productdetail.deals.productId,
              brandId: this.root.productdetail.deals.brandId,
              sellerId: this.root.productdetail.deals.sellerId,
              season: this.root.productdetail.deals.season,
              name: this.root.productdetail.deals.name,
              sellPrice: this.root.productdetail.deals.sellPrice,
              discountPrice: this.root.productdetail.deals.discountPrice,
            });

            ReactPixel.track('AddToCart', {
              dealId: this.root.productdetail.deals.dealsId,
              productId: this.root.productdetail.deals.productId,
              brandId: this.root.productdetail.deals.brandId,
              sellerId: this.root.productdetail.deals.sellerId,
              season: this.root.productdetail.deals.season,
              name: this.root.productdetail.deals.name,
              sellPrice: this.root.productdetail.deals.sellPrice,
              discountPrice: this.root.productdetail.deals.discountPrice,
            });
          })
          .catch((err) => {
            if (this.root.login.loginStatus === loginStatus.LOGOUT) {
              sendBackToLogin();
            }
            this.addCartStatus = false;
            this.isProductOptionModal = false;
          });
      } else {
        this.isProductOptionModal = true;
      }
    } else {
      sendBackToLogin();
    }
  };

  @action
  immediatePurchase = () => {
    let options = this.root.productoption.options;
    if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
      if (options.selectedOption) {
        this.addCartStatus = true;
        API.order
          .post(
            `/cart/addCartItem`,
            qs.stringify({
              dealId: this.root.productdetail.deals.dealsId,
              dealOptionId: options.selectedOption.id,
              quantity: options.selectedQuantity,
            }),
            {
              headers: {
                'content-type': 'application/x-www-form-urlencoded',
              },
            }
          )
          .then((res) => {
            let data = res.data;

            Router.push({
              pathname: '/orderpayment',
              query: {
                cartList: data.data.cartItemId,
              },
            });

            this.root.shoppingcart.globalGetUserShoppingCartList();
            this.addCartStatus = false;
            this.isProductOptionModal = false;
          })
          .catch((err) => {
            if (this.root.login.loginStatus === loginStatus.LOGOUT) {
              sendBackToLogin();
            }
            this.addCartStatus = false;
            this.isProductOptionModal = false;
          });
      } else {
        this.isProductOptionModal = true;
      }
    } else {
      sendBackToLogin();
    }
  };

  @action
  checkLoginStatus = () => {
    if (this.root.login.loginStatus === loginStatus.LOGOUT) {
      sendBackToLogin();
    } else {
      return true;
    }
  };

  @action
  reEntryNotify = () => {
    this.root.alert.showAlert({
      content: '재입고 알림 완료(현재기능없음)',
    });
  };
}

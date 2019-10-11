import { observable, action, toJS } from 'mobx';
import { loginStatus } from 'constant';
import API from 'lib/API';
import Router from 'next/router';
import { pushRoute } from 'lib/router';
import qs from 'qs';
import { devLog } from 'lib/devLog';

const isServer = typeof window === 'undefined';

export default class CartAndPurchaseStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable associatedProduct = [];

  @action
  setShoppingCart = () => {
    let options = this.root.productoption.options;
    if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
      if (options.selectedOption) {
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
          .then(res => {
            let data = res.data;
            if (data.resultCode === 200) {
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
                .then(res => {
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
                      Router.push('/shoppingcart');
                    },
                  });
                  this.root.shoppingcart.globalGetUserShoppingCartList();
                });
            }
          })
          .catch(err => {
            if (this.root.login.loginStatus === loginStatus.LOGOUT) {
              pushRoute(
                `/login?${qs.stringify({
                  redirectTo: `/productdetail?deals=${
                    this.root.productdetail.deals.dealsId
                  }`,
                })}`,
                { isReplace: true }
              );
            }
          });
      } else {
        this.root.alert.showAlert({
          content: '옵션을 선택 해주세요.',
        });
      }
    } else {
      pushRoute(
        `/login?${qs.stringify({
          redirectTo: `/productdetail?deals=${
            this.root.productdetail.deals.dealsId
          }`,
        })}`,
        { isReplace: true }
      );
    }
  };

  @action
  immediatePurchase = () => {
    let options = this.root.productoption.options;
    if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
      if (options.selectedOption) {
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
          .then(res => {
            let data = res.data;
            Router.push({
              pathname: '/orderpayment',
              query: {
                cartList: data.data.cartItemId,
              },
            });
            this.root.shoppingcart.globalGetUserShoppingCartList();
          })
          .catch(err => {
            if (this.root.login.loginStatus === loginStatus.LOGOUT) {
              pushRoute(
                `/login?${qs.stringify({
                  redirectTo: `/productdetail?deals=${
                    this.root.productdetail.deals.dealsId
                  }`,
                })}`,
                { isReplace: true }
              );
            }
          });
      } else {
        this.root.alert.showAlert({
          content: '옵션 을 선택해주세요.',
        });
      }
    } else {
      pushRoute(
        `/login?${qs.stringify({
          redirectTo: `/productdetail?deals=${
            this.root.productdetail.deals.dealsId
          }`,
        })}`,
        { isReplace: true }
      );
    }
  };
  @action
  reEntryNotify = () => {
    this.root.alert.showAlert({
      content: '재입고 알림 완료(현재기능없음)',
    });
  };
}

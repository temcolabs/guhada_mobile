import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { devLog } from 'childs/lib/common/devLog';

export default class MypageLikeStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable likeList = [];
  @observable likeProductList = [];
  @observable userInfo = JSON.parse(localStorage.getItem('guhada-userinfo'));
  @observable userId;
  @observable totalItemsCount = 0;
  @observable itemsCountPerPage = 20;
  @observable page = 1;

  @action
  getLikeList = () => {
    let userInfo = JSON.parse(this.userInfo.value);
    this.userId = userInfo.id;

    API.user.get(`/users/${this.userId}/likes`).then(res => {
      this.likeList = [];
      if (res.data.resultCode === 200) {
        devLog(res, 'res');
        this.totalItemsCount = res.data.data.totalElements;
        this.itemsCountPerPage = res.data.data.size;

        res.data.data.content.map(data => {
          this.likeList.push(data);
        });
        devLog(this.likeList);

        if (this.likeList.length > 0) {
          this.getLikeProductList();
        }
      } else {
        this.likeList = false;
        devLog(this.likeList);
      }
    });
  };

  @action
  getLikeProductList = () => {
    this.likeProductList = [];
    this.likeList.map(data => {
      API.product.get(`/products/${data.targetId}?viewType=LIST`).then(res => {
        let likeProduct = res.data.data;
        if (res.data.resultCode === 200) {
          this.likeProductList.push(likeProduct);
        }
      });
    });
  };

  @action
  likeItemDelete = id => {
    this.root.alert.showConfirm({
      content: '찜한 상품을 삭제하시겠습니까?',
      confirmText: '확인',
      cancelText: '취소',
      onConfirm: () => {
        this.likeItemDeleteApiCall(id);
      },
    });
  };

  likeItemDeleteApiCall = id => {
    API.user
      .delete(`/users/likes?target=PRODUCT&targetId=${id}`)
      .then(res => {
        if (res.data.resultCode === 200) {
          this.root.alert.showAlert({
            content: '찜한 상품이 삭제 되었습니다.',
          });
        }
      })
      .catch(err => {
        devLog(err, 'delete err');
      });
  };

  // @action
  // setShoppingCart = () => {
  //   if (this.root.login.loginStatus === loginStatus.LOGIN_DONE) {
  //     if (this.options.selectedOption) {
  //       API.order
  //         .post(
  //           `/cart/addCartItem`,
  //           qs.stringify({
  //             dealId: this.root.productdetail.deals.dealsId,
  //             dealOptionId: this.options.selectedOption.id,
  //             quantity: this.options.selectedQuantity,
  //           }),
  //           {
  //             headers: {
  //               'content-type': 'application/x-www-form-urlencoded',
  //             },
  //           }
  //         )
  //         .then(res => {
  //           let data = res.data;
  //           if (data.resultCode === 200) {
  //             API.product
  //               .get(
  //                 `/deals`,
  //                 qs.stringify({
  //                   brandId: this.root.productdetail.deals.brandId,
  //                   pageIndex: 0,
  //                   unitPerPage: 3,
  //                 }),
  //                 {
  //                   headers: {
  //                     'content-type': 'application/x-www-form-urlencoded',
  //                   },
  //                 }
  //               )
  //               .then(res => {
  //                 let data = res.data;
  //                 if (data.resultCode === 200) {
  //                   this.associatedProduct = data.data;
  //                   this.shoppingCartSuccess = true;
  //                 }
  //               });
  //           }
  //         })
  //         .catch(err => {
  //           if (this.root.login.loginStatus === 'logout') {
  //             this.root.alert.showAlert({
  //               content: '로그인 을 해주세요.',
  //             });
  //           } else {
  //             this.root.alert.showAlert({
  //               content: '서버 에러 ' + err,
  //             });
  //           }
  //         });
  //     } else {
  //       this.root.alert.showAlert({
  //         content: '옵션을 선택 해주세요.',
  //       });
  //     }
  //   } else {
  //     this.root.alert.showAlert({
  //       content: '로그인 을 해주세요.',
  //     });
  //   }
  // };

  @action
  likeSortChange = sort => {
    API.user
      .get(`/users/${this.userId}/likes?sort=id,${sort.value}`)
      .then(res => {
        this.likeList = [];
        if (res.data.resultCode === 200) {
          devLog(res, 'res');
          this.totalItemsCount = res.data.data.totalElements;
          this.itemsCountPerPage = res.data.data.size;

          res.data.data.content.map(data => {
            this.likeList.push(data);
          });
          devLog(this.likeList);

          if (this.likeList.length > 0) {
            this.getLikeProductList();
          }
        } else {
          this.likeList = false;
          devLog(this.likeList);
        }
      });
  };
}

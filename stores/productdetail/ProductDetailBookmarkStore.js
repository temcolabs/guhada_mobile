import { observable, action } from 'mobx';
import API from 'childs/lib/API';
import { devLog } from 'lib/devLog';
import _ from 'lodash';
import { sendBackToLogin } from 'lib/router';
const isServer = typeof window === 'undefined';

export default class ProductDetailLikeStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable bookMarkStatus = false;
  @observable bookMarkAdd = false;
  @observable userId;
  @action
  getBookMark = targetId => {
    this.userId = this.root.user.userInfo.id;
    if (this.userId) {
      API.user
        .get(
          `/users/${this.userId}/bookmarks?target=PRODUCT&targetId=${targetId}`
        )
        .then(res => {
          if (!res.data.data.empty) {
            this.bookMarkStatus = true;
          }
        })
        .catch(err => {
          devLog(err);
          // this.root.alert.showAlert({
          //   content: `${_.get(err, 'data.message') || '오류가 발생했습니다.'}`,
          // });
        });
    }
  };

  @action
  saveBookmark = id => {
    if (!this.bookMarkStatus) {
      API.user
        .post(`/users/bookmarks`, {
          target: 'PRODUCT',
          targetId: id,
        })
        .then(res => {
          this.bookMarkStatus = true;
          this.bookMarkAdd = 'on';
          // this.root.alert.showAlert({
          //   content: '해당상품을 북마크에 저장 했습니다.',
          // });
        })
        .catch(err => {
          let resultCode = _.get(err, 'data.resultCode');
          console.log(err, resultCode);

          if (resultCode === 6017) {
            sendBackToLogin();
          }

          // this.root.alert.showAlert({
          //   content: `${_.get(err, 'data.message') || '오류 발생'}`,
          // });
        });
    } else {
      API.user
        .delete(`/users/bookmarks?target=PRODUCT&targetId=${id}`)
        .then(res => {
          // this.root.alert.showAlert({
          //   content: '해당상품을 북마크 해제 했습니다.',
          //   confirmText: '확인',
          // });
          this.bookMarkStatus = false;
          this.bookMarkAdd = 'off';
        })
        .catch(err => {
          let resultCode = _.get(err, 'data.resultCode');
          console.log(err, resultCode);

          if (resultCode === 6017) {
            sendBackToLogin();
          }
          // this.root.alert.showAlert({
          //   content: `${_.get(err, 'data.message') || '오류 발생'}`,
          // });
        });
    }
  };

  @action
  productBookmarkInit = () => {
    this.bookMarkImageSrc = false;
    this.bookMarkAdd = false;
  };
}

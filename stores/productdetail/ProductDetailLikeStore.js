import { observable, action, toJS } from 'mobx';
import Cookies from 'js-cookie';
import Router from 'next/router';
import API from 'lib/API';

const isServer = typeof window === 'undefined';

export default class ProductDetailLikeStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable bookMarkImageSrc = '/static/icon/bookmark_btn_off.png';
  @observable currentUrl = document.location.href;
  @observable userInfo;
  @action
  getBookMark = userInfo => {
    this.userInfo = userInfo;
    API.user.get(`/users/${this.userInfo.id}/bookmarks`).then(res => {
      let data = res.data;
      if (res.data.resultCode === 200) {
        let bookMarkList = data.data;

        bookMarkList.map(data => {
          if (data.bookmarkUrl === this.currentUrl) {
            this.bookMarkImageSrc = '/static/icon/bookmark_btn_on.png';
          }
        });
      }
    });
  };

  @action
  saveLike = id => {
    console.log(id, 'fjisofjsoifjsofjsdiofjio');
    API.user
      .post(`/users/likes`, {
        target: 'PRODUCT',
        targetId: id,
      })
      .then(res => {
        if (res.data.resultCode === 200) {
          this.bookMarkImageSrc = '/static/icon/bookmark_btn_on.png';
          this.root.alert.showAlert({
            content: '해당상품 을 찜 했습니다.',
          });
        }
      })
      .catch(e => {
        console.error(e);
      });
  };
}

import { observable, action } from 'mobx';
import API from 'lib/API';

const isServer = typeof window === 'undefined';

export default class ProductDetailLikeStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable bookMarkImageSrc = false;
  @observable userId;
  @action
  getBookMark = targetId => {
    this.userId = this.root.user.userInfo.id;
    API.user
      .get(
        `/users/${this.userId}/bookmarks?target=PRODUCT&targetId=${targetId}`
      )
      .then(res => {
        if (!res.data.data.empty) {
          this.bookMarkImageSrc = true;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  @action
  saveBookmark = id => {
    API.user
      .post(`/users/bookmarks`, {
        target: 'PRODUCT',
        targetId: id,
      })
      .then(res => {
        this.bookMarkImageSrc = true;
        this.root.alert.showAlert({
          content: '해당상품 을 북마크에 저장 했습니다.',
        });
      })
      .catch(e => {
        this.root.alert.showAlert({
          content: e.data.message,
        });
      });
  };

  @action
  productBookmarkInit = () => {
    this.bookMarkImageSrc = false;
  };

  // @action
  // saveLike = id => {
  //   console.log(id, 'id');
  //   API.user
  //     .post(`/users/likes`, {
  //       target: 'PRODUCT',
  //       targetId: id,
  //     })
  //     .then(res => {
  //       this.bookMarkImageSrc = '/static/icon/bookmark_btn_on.png';
  //       this.root.alert.showAlert({
  //         content: '해당상품 을 찜 했습니다.',
  //       });
  //     })
  //     .catch(e => {
  //       console.error(e);
  //     });
  // };
}

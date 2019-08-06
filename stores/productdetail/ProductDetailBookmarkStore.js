import { observable, action } from 'mobx';
import API from 'lib/API';

const isServer = typeof window === 'undefined';

export default class ProductDetailLikeStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable bookMarkImageSrc = '/static/icon/m_like_btn_off.png';
  @observable currentLikeCheck = false;
  @observable userId;
  @action
  getBookMark = targetId => {
    this.userId = this.root.user.userInfo.id;
    API.user
      .get(
        `/users/${this.userId}/bookmarks?target=PRODUCT&targetId=${targetId}`
      )
      .then(res => {
        if (res.data.resultCode === 200) {
          this.currentLikeCheck = true;
        }
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
        this.currentLikeCheck = true;
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

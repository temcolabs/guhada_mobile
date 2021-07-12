import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import _ from 'lodash';
import { devLog } from 'lib/common/devLog';

const isServer = typeof window === 'undefined';

export default class ProductDetailLikeStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable currentLikeCheck = false;
  @observable userId = null;
  @observable likeList = [];
  @action
  getUserLike = () => {
    const getUserLikeList = () => {
      this.userId = this.root.user.userInfo.id;

      API.user.get(`/users/${this.root.user.userInfo.id}/likes`).then((res) => {
        let { data } = res;
        if (data.resultCode === 200) {
          this.likeList = data.data.content;
        } else {
          console.error(data.message);
        }
      });
    };

    const likeAction = () => {
      for (let i = 0; i < this.likeList?.length; i++) {
        if (
          this.likeList[i].targetId === this.root.productdetail.deals.productId
        ) {
          this.currentLikeCheck = true;
          return false;
        }
      }
    };

    if (_.isNil(_.get(this.root.user, 'userInfo.id'))) {
      // 유저 정보가 없으면, 유저 정보를 가져온 후 실행할 액션에 추가해준다.
      this.root.user.addFetched(getUserLikeList);
    } else {
      getUserLikeList();
    }

    if (_.isNil(_.get(this.root.productdetail, 'deals.productId'))) {
      // 유저 정보가 없으면, 유저 정보를 가져온 후 실행할 액션에 추가해준다.
      this.root.productdetail.addFetched(likeAction);
    } else {
      likeAction();
    }
  };

  @action
  saveLike = (id) => {
    devLog(id, 'id');
    if (this.currentLikeCheck) {
      API.user
        .delete(`/users/likes?target=PRODUCT&targetId=${id}`)
        .then((res) => {
          if (res.data.resultCode === 200) {
            this.currentLikeCheck = false;
            this.root.alert.showAlert({
              content: '찜 을 해제 하였습니다.',
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      API.user
        .post(`/users/likes`, {
          target: 'PRODUCT',
          targetId: id,
        })
        .then((res) => {
          if (res.data.resultCode === 200) {
            this.currentLikeCheck = true;
            this.root.alert.showAlert({
              content: '해당상품 을 찜 했습니다.',
            });
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };
}

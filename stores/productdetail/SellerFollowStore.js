import { observable, action } from 'mobx';
import API from 'lib/API';
import _ from 'lodash';
import { devLog } from 'lib/devLog';

const isServer = typeof window === 'undefined';

export default class SellerFollowStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable follows = false;
  @observable userId;
  @action
  getSellerFollow = targetId => {
    this.userId = this.root.user.userInfo.id;
    if (this.userId) {
      API.user
        .get(
          `/users/${this.userId}/bookmarks?target=SELLER&targetId=${targetId}`
        )
        .then(res => {
          const { data } = res.data;
          if (data.empty === false) {
            this.follows = true;
          } else {
            this.follows = false;
          }
        })
        .catch(err => {
          devLog('err', err);
        });
    }
  };

  @action
  setSellerFollow = id => {
    API.user
      .post(`/users/bookmarks`, {
        target: 'SELLER',
        targetId: id,
      })
      .then(res => {
        // this.root.alert.showAlert({
        //   content: '스토어 팔로우를 완료 했습니다.',
        // });
        this.follows = true;
      })
      .catch(err => {
        console.log(err, '스토어 팔로우 ERROR');
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || '스토어 팔로우 ERROR'}`,
        // });
      });
  };

  @action
  deleteSellerFollow = id => {
    API.user
      .delete(`/users/bookmarks?target=SELLER&targetId=${id}`)
      .then(res => {
        // this.root.alert.showAlert({
        //   content: '스토어 팔로우를 취소 했습니다.',
        // });
        this.follows = false;
      })
      .catch(err => {
        console.log(err, '스토어 팔로우 ERROR');
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || '스토어 팔로우 ERROR'}`,
        // });
      });
  };
}

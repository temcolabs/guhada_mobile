import { observable, action, toJS, extendObservable } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import { loginStatus } from 'lib/constant';
import _ from 'lodash';
import { devLog } from 'lib/common/devLog';
export default class MypageFollowStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable followList = [];
  @observable totalItemsCount = 0;
  @observable itemsCountPerPage = 20;
  @observable pageNo = 1;
  @observable reverseList = false;
  @observable userId = 0;
  @action
  getFollowList = ({ pageNo = 1 }) => {
    let action = () => {
      this.userId = this.root.user.userId;
      API.user
        .get(`users/${this.userId}/followings`)
        .then((res) => {
          devLog(res, 'following list');
          this.followList = [];
          this.pageNo = pageNo;
          let temp = res.data.data;
          for (let i = 0; i < temp.length; i++) {
            temp[i].status = true;
          }
          this.followList = temp;
          // this.totalItemsCount = res.data.data.totalElements;
          // this.itemsCountPerPage = this.itemsCountPerPage;
          this.pageStatus = true;
        })
        .catch((err) => {
          console.error(err);
          this.followList = [];
          // this.totalItemsCount = 0;
          // this.itemsCountPerPage = this.itemsCountPerPage;
        });
    };

    this.root.user.pushJobForUserInfo(action);
  };

  likeSortChange = (sort) => {
    if (sort.value === 'ASC') {
      this.reverseList = true;
    } else {
      this.reverseList = false;
    }
  };

  @action
  setSellerFollow = (id) => {
    API.user
      .post(`/users/bookmarks`, {
        target: 'SELLER',
        targetId: id,
      })
      .then((res) => {
        for (let i = 0; i < this.followList.length; i++) {
          if (this.followList[i].sellerId === id) {
            this.followList[i].status = true;
          }
        }
        this.root.sellerfollow.follows = true;
      })
      .catch((err) => {
        console.error(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || '스토어 팔로우 ERROR'}`,
        // });
      });
  };

  @action
  deleteSellerFollow = (id) => {
    API.user
      .delete(`/users/bookmarks?target=SELLER&targetId=${id}`)
      .then((res) => {
        for (let i = 0; i < this.followList.length; i++) {
          if (this.followList[i].sellerId === id) {
            this.followList[i].status = false;
          }
        }
        this.root.sellerfollow.follows = false;
      })
      .catch((err) => {
        console.error(err);
        // this.root.alert.showAlert({
        //   content: `${_.get(err, 'data.message') || '스토어 팔로우 ERROR'}`,
        // });
      });
  };
}

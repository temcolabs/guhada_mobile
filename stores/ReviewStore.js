import { observable, action, computed } from 'mobx';
import API from 'childs/lib/API';
import bookmarkTarget from 'childs/lib/constant/user/bookmarkTarget';

import { toJS } from 'mobx';
const isServer = typeof window === 'undefined';
export default class ReviewStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  // Observable
  @observable reviewBannerList = [];
  @observable reviewHashtagList = [];
  @observable reviewBookMarkList = [];
  @observable reviewPage = {};
  @observable reviewList = [];

  // computed
  @computed get reviewItems() {
    console.log('this.reviewPage : ', toJS(this.reviewPage));
    return this.reviewPage.empty
      ? this.reviewList
      : this.reviewList.concat(this.reviewPage.content);
  }

  // actions
  @action
  getReviewBannerList = async () => {
    try {
      const { data } = await API.user('/event/banner?bannerType=REVIEW');
      const result = data.data;

      if (result.length) {
        this.reviewBannerList = result.deals;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  @action
  getReviewPopularHashTag = async () => {
    try {
      const { data } = await API.user('/reviews/popularity/hashtag');
      const result = data.data;

      if (result.length) {
        this.reviewHashtagList = result;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  @action
  getReviewList = async (page = 1, unitPerPage = 20, categoryName = '전체') => {
    try {
      const { data } = await API.user(
        `/reviews/all?page=${page}&unitPerPage=${unitPerPage}&categoryName=${categoryName}`
      );
      const result = data.data;
      if (Object.keys(result)) {
        this.reviewPage = result?.userProductReviewResponsePage;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  @action
  getProductReviewBookmarks = () => {
    const userId = this.root.user.userInfo.id;
    API.user
      .get(`/users/${userId}/bookmarks`, {
        params: {
          target: bookmarkTarget.REVIEW,
        },
      })
      .then((res) => {
        this.reviewBookMarkList = res.data.data.content;
      })
      .catch((e) => {
        console.error('e', e);
      });
  };
}

import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import { devLog } from 'childs/lib/common/devLog';
import bookmarkTarget from 'childs/lib/constant/user/bookmarkTarget';
import _ from 'lodash';
const isServer = typeof window === 'undefined';

export default class SellerReviewStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable review = [];
  @observable reviewSummary;
  @observable reviewTab = 'all';
  @observable order = '';
  @observable sort = 'created_at,desc';
  @observable initialPage = 1;
  @observable rating = '';
  @observable reviewBookMarks;
  @observable photoPoint = 0;
  @observable textPoint = 0;
  @observable maximumPoint = 0;
  @observable sellerId;

  @action
  setReviewTab = (tab, rating = '') => {
    if (tab !== 'all') {
      this.rating = '';
    } else {
      this.rating = rating;
    }

    this.reviewTab = tab;
    this.changeReview(0);
  };

  @action
  changeReview = (page = '0') => {
    this.initialPage = page;
    switch (this.reviewTab) {
      case 'all':
        this.getProductReview(page);
        break;
      case 'photo':
        this.getProductReviewPhoto(page);
        break;
      case 'personal':
        this.getProductReviewUserSize(page);
        break;
      // case 'reply':
      //   productreview.getProductReviewPhoto();
      //   break;
      default:
        this.getProductReview(page);
        break;
    }
  };

  // dir = 'desc', 'asc'  sort = 'created_at', 'product_rating'
  @action
  setOrder = (sort, dir) => {
    this.sort = `${sort},${dir}`;

    this.changeReview(0);
  };

  @action
  setRating = rating => {
    this.rating = rating;
    this.getProductReview();
  };

  @observable reviewPage = 0;
  @observable unitPerPage = 5;

  @action
  getProductReview = (reviewPage = '0') => {
    this.reviewPage = 0;

    API.user
      .get(`/reviews`, {
        params: {
          sellerId: this.sellerId,
          page: reviewPage,
          size: this.unitPerPage,
          sort: this.sort,
          rating: this.rating,
        },
      })
      .then(res => {
        let data = res.data;

        if (data.resultCode === 200) {
          this.review = data.data;
        }

        if (this.root.login.loginStatus === 'LOGIN_DONE')
          this.getProductReviewBookmarks();
      })
      .catch(e => {
        this.review = [];
      });
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
      .then(res => {
        this.reviewBookMarks = res.data.data.content;
      })
      .catch(e => {
        console.error('e', e);
      });
  };

  @action
  setProductReviewBookmarks = id => {
    API.user
      .post(`/users/bookmarks`, {
        target: bookmarkTarget.REVIEW,
        targetId: id,
      })
      .then(res => {
        // this.changeReview();
        if (this.root.login.loginStatus === 'LOGIN_DONE')
          this.getProductReviewBookmarks();
      })
      .catch(e => {
        console.error('e', e);
      });
  };

  @action
  delProductReviewBookmarks = id => {
    API.user
      .delete(`/users/bookmarks`, {
        params: {
          target: bookmarkTarget.REVIEW,
          targetId: id,
        },
      })
      .then(res => {
        // this.changeReview();
        if (this.root.login.loginStatus === 'LOGIN_DONE')
          this.getProductReviewBookmarks();
      })
      .catch(e => {
        console.error('e', e);
      });
  };

  @action
  addReview = () => {
    this.reviewPage += 1;
    API.user
      .get(
        this.reviewTab === 'all'
          ? `/reviews`
          : this.reviewTab === 'photo'
          ? `/reviews/photo`
          : `/reviews/user-size`,
        {
          params: {
            sellerId: this.sellerId,
            page: this.reviewPage,
            size: this.unitPerPage,
            sort: this.sort,
            rating: this.reviewRating,
          },
        }
      )
      .then(res => {
        let data = res.data;
        devLog('data', data);
        if (data.resultCode === 200) {
          let newReview = this.review.content;
          this.review.content = newReview.concat(data.data.content);
        } else {
          this.root.alert.showAlert({
            content: '리뷰 데이터가 더 이상 존재하지 않습니다.',
          });
        }
      });
  };

  @action
  getProductReviewPhoto = (page = '0') => {
    API.user
      .get(`/reviews/photo`, {
        params: {
          sellerId: this.sellerId,
          page: this.reviewPage,
          size: this.unitPerPage,
          sort: this.sort,
        },
      })
      .then(res => {
        let data = res.data;
        this.review = data.data;

        if (this.root.login.loginStatus === 'LOGIN_DONE')
          this.getProductReviewBookmarks();
      })
      .catch(e => {
        this.review = [];
      });
  };

  @action
  getProductReviewUserSize = (page = '0') => {
    API.user
      .get(`/reviews/user-size`, {
        params: {
          sellerId: this.sellerId,
          page: this.reviewPage,
          size: this.unitPerPage,
          sort: this.sort,
        },
      })
      .then(res => {
        let data = res.data;
        this.review = data.data;

        if (this.root.login.loginStatus === 'LOGIN_DONE')
          this.getProductReviewBookmarks();
      })
      .catch(e => {
        this.review = [];
      });
  };

  @action
  getProductReviewSummary = () => {
    let productId = this.root.productdetail.deals.productId;

    API.user
      .get(`/reviews/summary`, { params: { productId: productId } })
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.reviewSummary = data.data;
        }
      })
      .catch(e => {
        if (_.get(e, 'data.resultCode') === 5004) {
          this.reviewSummary = null;
        }
      });
  };

  @action
  getProductReviewPoint = () => {
    API.benefit
      .post(`/process/due-save`, {
        pointType: 'REVIEW',
        serviceType: 'FRONT',
      })
      .then(res => {
        let data = res.data.data;
        this.reviewPoint = data.dueSavePointList;
        let pointTemp = data.dueSavePointList.find(
          o => o.pointType === 'IMG_REVIEW'
        );
        this.photoPoint = pointTemp.totalPoint;

        pointTemp = data.dueSavePointList.find(
          o => o.pointType === 'TEXT_REVIEW'
        );

        this.textPoint = pointTemp.totalPoint;

        this.maximumPoint = Math.max.apply(
          Math,
          data.dueSavePointList.map(function(o) {
            return o.totalPoint;
          })
        );
      });
  };
}

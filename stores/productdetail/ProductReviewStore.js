import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import Axios from 'axios';

const isServer = typeof window === 'undefined';

export default class ProductReviewStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable review = [];
  @observable reviewSummary;
  @observable reviewTab = 'all';
  @observable order = '';
  @observable sort = 'created_at';
  @observable initialPage = 1;
  @observable rating = '';

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
    let productId = this.root.productdetail.deals.productId;
    this.reviewPage = 0;

    API.user
      .get(`/products/${productId}/reviews`, {
        params: {
          page: reviewPage,
          size: this.unitPerPage,
          sort: this.sort,
          rating: this.rating,
        },
      })
      .then(res => {
        let data = res.data;
        // console.log('data', data);
        if (data.resultCode === 200) {
          this.review = data.data;
        } else if (data.resultCode === 5004) {
          this.review = [];
        } else {
          this.root.alert.showAlert({
            content: '리뷰 데이터가 더 이상 존재하지 않습니다.',
          });
        }
      });
  };

  @action
  addReview = () => {
    let productId = this.root.productdetail.deals.productId;
    this.reviewPage += 1;
    API.user
      .get(`/products/${productId}/reviews`, {
        params: {
          page: this.reviewPage,
          size: this.unitPerPage,
          sort: this.sort,
          rating: this.reviewRating,
        },
      })
      .then(res => {
        let data = res.data;
        console.log('data', data);
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
    let productId = this.root.productdetail.deals.productId;

    API.user
      .get(`/products/${productId}/reviews/photo`, {
        params: {
          page: this.reviewPage,
          size: this.unitPerPage,
          sort: this.sort,
        },
      })
      .then(res => {
        let data = res.data;

        if (data.resultCode === 200) {
          this.review = data.data;
        } else if (data.resultCode === 5004) {
          this.review = [];
        }
      });
  };

  @action
  getProductReviewUserSize = (page = '0') => {
    let productId = this.root.productdetail.deals.productId;

    API.user
      .get(`/products/${productId}/reviews/user-size`, {
        params: {
          page: this.reviewPage,
          size: this.unitPerPage,
          sort: this.sort,
        },
      })
      .then(res => {
        let data = res.data;
        console.log('data', data);
        if (data.resultCode === 200) {
          this.review = data.data;
        } else if (data.resultCode === 5004) {
          this.review = [];
        }
      });
  };

  @action
  getProductReviewSummary = () => {
    let productId = this.root.productdetail.deals.productId;

    API.user.get(`/products/${productId}/reviews/summary`).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.reviewSummary = data.data;
      } else if (data.resultCode === 5004) {
        this.review = [];
      }
    });
  };
}

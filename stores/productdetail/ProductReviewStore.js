import { observable, action, toJS } from 'mobx';
import API from 'lib/API';
import Axios from 'axios';

const isServer = typeof window === 'undefined';

export default class ProductReviewStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable review;
  @observable reviewSummary;
  @observable reviewTab;

  @action
  getProductReview = (dir = 'DESC', page = '0', sort = 'created_at') => {
    let productId = this.root.productdetail.deals.productId;

    API.user
      .get(`/products/${productId}/reviews`, {
        params: {
          dir: dir,
          pageNo: page,
          pageSize: 5,
          sort: sort,
        },
      })
      .then(res => {
        let data = res.data;
        console.log('data', data);
        if (data.resultCode === 200) {
          this.review = data.data;
        }
      });
  };

  @action
  getProductReviewPhoto = (dir = 'DESC', page = '0', sort = 'created_at') => {
    let productId = this.root.productdetail.deals.productId;

    API.user
      .get(`/products/${productId}/reviews/photo`, {
        params: {
          dir: dir,
          pageNo: page,
          pageSize: 5,
          sort: sort,
        },
      })
      .then(res => {
        let data = res.data;
        console.log('data', data);
        if (data.resultCode === 200) {
          this.review = data.data;
        }
      });
  };

  @action
  getProductReviewUserSize = (
    dir = 'DESC',
    page = '0',
    sort = 'created_at'
  ) => {
    let productId = this.root.productdetail.deals.productId;

    API.user
      .get(`/products/${productId}/reviews/user-size`, {
        params: {
          dir: dir,
          pageNo: page,
          pageSize: 5,
          sort: sort,
        },
      })
      .then(res => {
        let data = res.data;
        console.log('data', data);
        if (data.resultCode === 200) {
          this.review = data.data;
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
      }
    });
  };
}

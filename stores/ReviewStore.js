import { observable, action } from 'mobx';
import API from 'childs/lib/API';

export default class ReviewStore {
  // Observable
  @observable reviewBannerList = [];
  @observable reviewHashtagList = [];
  @observable reviewList = {
    
  };

  // computed

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
  getReviewList = async ({ page = 1, unitPerPage = 20, categoryName }) => {
    try {
      const { data } = await API.search('/event/banner?bannerType=REVIEW');
      const result = data.data;

      if (result.length) {
        this.reviewBannerList = result.deals;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
}

import { observable, action, computed } from 'mobx';
import API from 'childs/lib/API';
import bookmarkTarget from 'childs/lib/constant/user/bookmarkTarget';

import { toJS } from 'mobx';
const isServer = typeof window === 'undefined';
const initialSearchForm = {
  page: 1,
  unitPerPage: 20,
  categoryName: '전체',
};
export default class ReviewStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  // Observable
  @observable reviewPage = {};
  @observable reviewList = [];
  @observable searchForm = { ...initialSearchForm };

  // actions
  @action
  initReviewPage = () => (this.reviewPage = {});
  @action
  initReviewList = () => (this.reviewList = []);
  @action
  initSearchForm = () => (this.searchForm = {...initialSearchForm});
  @action
  setSearchForm = (search) => {
    this.searchForm = search;
  };

  /**
   * 리뷰 전체 조회
   * @param {Number} page : 리뷰 페이지
   * @param {Number} unitPerPage : 리뷰 페이지 컨텐츠
   * @param {String} categoryName : 리뷰 종류
   */
  @action
  getReviewList = async ({
    page = 1,
    unitPerPage = 20,
    categoryName = '전체',
  }) => {
    try {
      const { data } = await API.user(
        `/reviews/all?page=${page}&unitPerPage=${unitPerPage}&categoryName=${categoryName}`
      );
      const result = data.data;
      if (Object.keys(result).length) {
        this.reviewPage = result.userProductReviewResponsePage;
      }
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 사용자 북마크 추가 (좋아요)
   * @param {Number} id
   */
  @action
  setProductReviewBookmarks = (id) => {
    API.user
      .post(`/users/bookmarks`, {
        target: bookmarkTarget.REVIEW,
        targetId: id,
      })
      .then((res) => {
        // object active 수정
        if (this.root.login.loginStatus === 'LOGIN_DONE')
          this.getProductReviewBookmarks();
      })
      .catch((e) => {
        console.error('e', e);
      });
  };

  /**
   * 사용자 북마크 삭제 (좋아요 취소)
   * @param {Number} id
   */
  @action
  delProductReviewBookmarks = (id) => {
    API.user
      .delete(`/users/bookmarks`, {
        params: {
          target: bookmarkTarget.REVIEW,
          targetId: id,
        },
      })
      .then((res) => {
        // object active 수정
        if (this.root.login.loginStatus === 'LOGIN_DONE')
          this.getProductReviewBookmarks();
      })
      .catch((e) => {
        console.error('e', e);
      });
  };
}

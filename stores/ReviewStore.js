import { observable, action } from 'mobx';
import { stringify } from 'qs';
import API from 'childs/lib/API';
import bookmarkTarget from 'childs/lib/constant/user/bookmarkTarget';

import { toJS } from 'mobx';
const isServer = typeof window === 'undefined';
export default class ReviewStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  // Initialized
  DEFAULT_REVIEW_PAGE = {
    isPending: false,
    content: [],
    empty: false,
    first: false,
    last: false,
    number: 0,
    numberOfElements: 0,
    pageable: {},
    size: 0,
    sort: {},
    totalElements: 0,
    totalPages: 0,
  };

  DEFAULT_SEARCH_FORM = {
    page: 1,
    unitPerPage: 10,
    categoryName: '전체',
  };

  // Observable
  // 리뷰
  @observable reviewPage = this.DEFAULT_REVIEW_PAGE; // 리뷰 조회 Object
  @observable searchForm = this.DEFAULT_SEARCH_FORM; // 검색 Object
  @observable reviewList = []; // 리뷰 List
  @observable reviewRecommendList = []; // 추천 리뷰 List

  // 상세 리뷰
  @observable reviewDetail = null; // 상세 리뷰
  @observable reviewDetailComments = null; // 상세 리뷰 댓글

  // 해시태그
  @observable reviewHashtagList = []; // Popularty 해시태그 List
  @observable reviewHashtagDetail = null; // 해시태그 상세
  @observable reviewHashtagDetailList = []; // 해시태그 상세 리스트

  // 추천 상품
  @observable dealsOfSameBrand = []; // 유사한 상품
  @observable dealsOfRecommend = []; // 추천 상품

  // actions
  @action
  initReviewStore = () => {
    this.reviewPage = this.DEFAULT_REVIEW_PAGE;
    this.searchForm = this.DEFAULT_SEARCH_FORM;
    this.reviewList = [];
    this.reviewHashtagList = [];
  };
  @action
  initReviewDetail = () => {
    this.reviewDetail = null;
    this.reviewDetailComments = null;
    this.reviewRecommendList = [];
  };
  @action
  initReviewHashtag = () => {
    this.reviewHashtagDetail = null;
    this.reviewHashtagDetailList = [];
  };
  @action
  setSearchForm = (search) => (this.searchForm = search);

  /**
   * 리뷰 전체 조회
   * @param {Number} page : 리뷰 페이지
   * @param {Number} unitPerPage : 리뷰 페이지 컨텐츠
   * @param {String} categoryName : 리뷰 종류
   */
  @action
  getReviewList = async ({
    page = 1,
    unitPerPage = 10,
    categoryName = '전체',
  }) => {
    try {
      const { data } = await API.user(
        `/reviews/all?page=${page}&unitPerPage=${unitPerPage}&categoryName=${categoryName}`
      );
      const result = data.data;
      if (Object.keys(result).length) {
        this.reviewPage = result.userProductReviewResponsePage;
        this.reviewList = [...this.reviewList, ...this.reviewPage.content];
      }
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 리뷰 상세 조회
   * @param {Number} reviewId, 리뷰 ID
   * @returns
   */
  @action
  getReview = async ({ reviewId }) => {
    try {
      const { data } = await API.user.get(`/reviews/${reviewId}`);
      const result = data.data;
      if (Object.keys(result).length) {
        this.reviewDetail = result;
      }
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 리뷰 댓글 조회
   * @param {Number} reviewId, 리뷰 ID
   * @returns
   */
  @action
  getReviewComments = async ({ reviewId }) => {
    try {
      const { data } = await API.user.get(`/reviews/${reviewId}/comments`);
      const result = data.data;
      if (Object.keys(result).length) {
        this.reviewDetailComments = result;
      }
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 리뷰 해시태그 조회
   * @param {Number} reviewId, 리뷰 ID
   * @returns
   */
  @action
  getReviewHashtags = async () => {
    try {
      const { data } = await API.user('/reviews/popularity/hashtag');
      const result = data.data;
      if (Object.keys(result).length) {
        this.reviewHashtagList = result;
      }
      return result.length ? result : null;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 리뷰 해시태그 상세 조회
   * @param {*} param0
   * @returns
   */
  @action
  getSearchReviewHashtags = async ({
    hashtag,
    page = 1,
    sortType,
    unitPerPage = 15,
  }) => {
    try {
      const { data } = await API.user(
        `/reviews/search/hashtag?${stringify({
          hashtag,
          page,
          sortType,
          unitPerPage,
        })}`
      );
      const result = data.data;
      if (Object.keys(result).length) {
        this.reviewHashtagDetail = result;
        this.reviewHashtagDetailList = [
          ...this.reviewHashtagDetailList,
          ...result?.content,
        ];
      }
      return result.length ? result : null;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 사용자 북마크 추가 (좋아요)
   * @param {Number} id
   */
  @action
  setProductReviewBookmarks = async (review) => {
    try {
      const { data } = await API.user.post(`/users/bookmarks`, {
        target: bookmarkTarget.REVIEW,
        targetId: review.id,
      });
      if (data?.resultCode === 200) {
        review.myBookmarkReview = true;
        review.bookmarkCount += 1;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 사용자 북마크 삭제 (좋아요 취소)
   * @param {Number} id
   */
  @action
  delProductReviewBookmarks = async (review) => {
    try {
      const { data } = await API.user.delete(
        `/users/bookmarks?target=${bookmarkTarget.REVIEW}&targetId=${review.id}`
      );
      if (data?.resultCode === 200) {
        review.myBookmarkReview = false;
        review.bookmarkCount -= 1;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 비슷한 상품 조회
   */
  @action
  getDealsOfSameBrand = ({ productId }) => {
    API.search
      .post(
        `/ps/search/seller/related`,
        { productId },
        { params: { page: 1, unitPerPage: 6 } }
      )
      .then((res) => {
        let data = res.data;
        this.dealsOfSameBrand = data.data.deals;
      });
  };

  /**
   * 추천 상품 조회
   */
  @action
  getDealsOfRecommend = ({ productId }) => {
    API.search
      .post(
        `/ps/search/seller/popular`,
        { productId },
        { params: { page: 1, unitPerPage: 6 } }
      )
      .then((res) => {
        let data = res.data;
        this.dealsOfRecommend = data.data.deals;
      });
  };

  /**
   * 추천 리뷰 조회
   * @param {Number} reviewId, 리뷰 ID
   * @returns
   */
  @action
  getRecommendReviews = async ({ reviewId }) => {
    try {
      const { data } = await API.user.get(
        `/reviews/${reviewId}/recommend/reviews`
      );
      const result = data.data;
      if (Object.keys(result).length) {
        this.reviewRecommendList = result.slice(0, 6);
      }
      return result;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 리뷰 댓글 작성
   * @param {Number} reviewId
   * @param {Object} param0
   * @returns
   */
  @action
  createReviewComments = async ({
    reviewId,
    param = {
      comment: '',
    },
  }) => {
    try {
      const { data } = await API.user.post(
        `/reviews/${reviewId}/comments`,
        param
      );
      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * 리뷰 댓글 삭제
   * @param {Number} reviewId
   * @param {Object} param0
   * @returns
   */
  @action
  deleteReviewComments = async ({ commentId }) => {
    try {
      const { data } = await API.user.delete(`/reviews/comments/${commentId}`);
      return data;
    } catch (error) {
      console.error(error.message);
    }
  };
}

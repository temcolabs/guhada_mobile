import { isBrowser } from 'childs/lib/common/isServer';
import { observable, action, computed, toJS } from 'mobx';
import API from 'childs/lib/API';
import _ from 'lodash';
import qs from 'qs';
import bookmarkTarget from 'childs/lib/constant/user/bookmarkTarget';
import guhadaClientPlatform from 'childs/lib/constant/guhadaClientPlatform';
import userLikeService from 'childs/lib/API/user/userLikeService';
import { sendBackToLogin } from 'childs/lib/router';
import { bbsTargetTypes } from 'childs/lib/API/user/userLikeService';
import { devLog } from 'childs/lib/common/devLog';
class ArticleStore {
  constructor(root, initialState = {}) {
    if (isBrowser) {
      this.root = root;
    }

    this.userIp = _.get(initialState, 'bbs.article.userIp');
    this.data = _.get(initialState, 'bbs.article.data') || {};
  }

  // 유저 IP
  @observable userIp = null;

  defaultArticleData = {
    id: 0,
    categoryId: 0,
    categoryFilterId: 0,
    title: '',
    contents: '', // html markup
    use: true,
    delete: false,
    deletedAt: null,
    like: false, // 내가 좋아요 했는지
    commentCount: 0, // 댓글 수,
    hitCount: 0, // 조회수
    likeCount: 0,
    dspCreatedAt: '',
    userId: 0,
    createUserInfo: {
      // 작성자 정보
      // * 실제 데이터의 일부분만 넣어둠
      nickname: '',
      profileImageUrl: '',
    },
  };

  // 조회 중인 게시글 데이터
  @observable
  data = _.merge({}, this.defaultArticleData);

  @observable
  isArticleFetched = false;

  @action
  initArticleData = () => {
    this.data = _.merge({}, this.defaultArticleData);
  };

  // 게시글이 속한 게시판(category) 이름
  // CategoryStore가 필요한다
  @computed
  get articleCategoryName() {
    if (this.root) {
      const category = _.get(this.root, 'bbs.category');

      const articleCategory = category.allCategories.find(
        c => c.id === this.data.categoryId
      );

      return articleCategory ? articleCategory.name : '';
    } else {
      return '';
    }
  }

  @computed
  get articleId() {
    return this.data?.id || '';
  }

  // 본문
  @computed
  get contents() {
    return this.data?.contents || '';
  }

  // 게시글 공유 URL
  @computed
  get shareURL() {
    return `${process.env.HOSTNAME}/community/article/${this.data?.id}`;
  }

  // 내가 쓴 글인지?
  @computed
  get isMyArticle() {
    return this.data?.userId === this.root.user.userId;
  }

  // 모바일에서 작성된 글인지.
  @computed
  get isCreatedOnMobile() {
    return this.data.guhadaClientPlatform === guhadaClientPlatform.MOBILE;
  }

  @computed
  get bbsImageList() {
    return this.data?.bbsImageList || [];
  }

  // 게시글 API 호출
  @action
  getArticle = async ({ id } = {}) => {
    try {
      this.isArticleFetched = false;
      const { data } = await API.bbs.get(
        `/bbses/${id}?${qs.stringify({ userIp: this.userIp })}`
      );

      devLog(data, 'data');
      const articleData = data.data;
      this.data = articleData;
      return articleData;
    } catch (e) {
      this.data = {};
      console.error(e);
    } finally {
      this.isArticleFetched = true;
    }
  };

  articleBodyForRegister = {
    title: '', // * 필수 string, 게시글 제목
    contents: '', // * 필수 string, 게시글 내용
    categoryId: 1, // * 필수 number, 커뮤니티 아이디
    categoryFilterId: 1, // * number, 커뮤니티 filter 아이디

    // ! 상품(deal)과 브랜드 정보 포함 여부는 카테고리의 requiredProductSearch 값에 따라 필수 여부 변경됨
    dealId: null, // number, 딜 아이디
    dealName: '', // string, 딜 이름
    brandId: null, // number, 브랜드 아이디
    brandName: '', // string, 브랜드 이름

    delete: false,
    use: true, // * 필수 boolean,게시글 사용 유무
  };

  /**
   * 게시글 수정
   */
  updateArticle = async ({
    articleId = 0,
    body = this.articleBodyForRegister,
    onSuccess = () => {},
  }) => {
    // API 호출에 사용할 데이터
    const postBody = _.merge({}, this.articleBodyForRegister, body);

    try {
      await API.bbs.put(`/bbses/${articleId}`, postBody);
      onSuccess();
    } catch (e) {
      console.error(e);
      this.root.alert.showAlert({
        content: '오류가 발생했습니다.',
      });
    }
  };

  /**
   * 게시글 생성
   */
  createArticle = async ({
    body = this.articleBodyForRegister,
    isImageRequired = false,
    onSuccess = () => {},
  }) => {
    // API 호출에 사용할 데이터
    const postBody = _.merge({}, this.articleBodyForRegister, body);
    console.log(postBody, 'postBody postBody');
    try {
      await API.bbs.post(`/bbses`, postBody);
      onSuccess();
    } catch (e) {
      console.error(e);
      this.root.alert.showAlert({
        content: '오류가 발생했습니다.',
      });
    }
  };

  /**
   * 게시글 삭제
   */
  deleteArticle = async ({ articleData, onSuccess = () => {} } = {}) => {
    const { id } = articleData;

    if (this.isMyArticle) {
      try {
        await API.bbs.delete(`/bbses/${id}`);
        onSuccess();
      } catch (e) {
        console.error(e);
        this.root.alert.showAlert('오류가 발생했습니다.');
      }
    } else {
      console.error('로그인한 사용자의 글만 삭제 가능합니다.');
    }
  };

  /**
   * 게시글 북마크
   */
  @action
  addBookmarkToArticle = async ({ articleId } = {}) => {
    if (this.root.login.isLoggedIn) {
      try {
        await API.user.post(`/users/bookmarks`, {
          target: bookmarkTarget.BBS,
          targetId: articleId,
        });

        this.data = _.merge(this.data, { bookmark: true });

        this.root.bbs.myBBS.getMyBookmarks();
      } catch (e) {
        console.error(e);
      }
    } else {
      sendBackToLogin();
    }
  };

  /**
   * 게시글 북마크 정보 삭제
   */
  @action
  removeBookmarkFromArticle = async ({ articleId } = {}) => {
    try {
      await API.user.delete(
        `/users/bookmarks?${qs.stringify({
          target: bookmarkTarget.BBS,
          targetId: articleId,
        })}`
      );

      this.data = _.merge(this.data, { bookmark: false });

      this.root.bbs.myBBS.getMyBookmarks();
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * 게시글 좋아요
   * TODO: user API에서 스펙 확인
   */
  @action
  addLikeArticle = async ({ articleId } = {}) => {
    if (this.root.login.isLoggedIn) {
      try {
        await userLikeService.saveUserLike({
          userId: this.root.user.userId,
          target: bbsTargetTypes.BBS,
          targetId: articleId,
        });

        // 좋아요 상태 업데이트. API 추가 호출하지 않고 한다.
        this.data = _.merge(this.data, {
          like: true,
          likeCount: this.data.likeCount + 1,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      sendBackToLogin();
    }
  };

  /**
   * 게시글 좋아요 정보 삭제
   */
  @action
  removeLikeArticle = async ({ articleId } = {}) => {
    if (this.root.login.isLoggedIn) {
      try {
        await userLikeService.deleteUserLike({
          userId: this.root.user.userId,
          target: bbsTargetTypes.BBS,
          targetId: articleId,
        });

        // 좋아요 상태 업데이트. API 추가 호출하지 않고 한다.
        this.data = _.merge(this.data, {
          like: false,
          likeCount: this.data.likeCount - 1,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      sendBackToLogin();
    }
  };
}

export default ArticleStore;

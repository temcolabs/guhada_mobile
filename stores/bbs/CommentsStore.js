import { observable, action, computed } from 'mobx';
import { isBrowser } from 'lib/common/isServer';
import API from 'lib/API';
import _ from 'lodash';
import moment from 'moment';
import userLikeService, { bbsTargetTypes } from 'lib/API/user/userLikeService';
import { sendBackToLogin } from 'lib/router';

export default class CommentsStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }
  }

  defaultData = {
    content: [],
    empty: false,
    first: true,
    last: false,
    number: 0, // ?
    numberOfElements: 0,
    pageable: {},
    size: 10,
    sort: { sorted: true, unsorted: false, empty: false },
    totalElements: 0,
    totalPages: 0,
    like: false,
    likeCount: 0,
  };

  // 댓글 데이터
  @observable
  data = Object.assign({}, this.defaultData);

  /**
   * 댓글 등록에 사용할 기본 데이터
   *
   * communityBbsId: 게시글 아이디
   * contents
   * originCommentId 댓글 대상의 아이디
   * parentCommentId: 대듯글일 때 상위 댓글 아이디 (최상위 댓글)
   */
  defaultCommentParams = {
    isSubComment: false,
    communityBbsId: 0,
    contents: 0,
    originCommentId: 0,
    parentCommentId: 0,
    imageList: [],
  };

  @computed
  get list() {
    return _.get(this, 'data.content') || [];
  }

  @observable
  commentsQuery = {}; // 댓글을 가져올 때 사용한 파라미터를 그대로 저장. 새로고침에 사용한다

  /**
   * 댓글 목록 가져오기
   *
   * https://dev.bbs.guhada.com/swagger-ui.html#/community-bbs-comment-controller/getBbsCommentsUsingGET
   */
  @action
  getComments = async ({
    communityBbsId, //  * required 게시글 아이디
    page = 1, // * required
    unitPerPage = 10, // * required
    orderType,
    sortType = 'CREATED',
  } = {}) => {
    this.commentsQuery = {
      communityBbsId,
      page,
      unitPerPage,
      sortType,
      orderType,
    };
    this.commentsQuery.page = 1;
    try {
      const { data } = await API.bbs.get(`/comments`, {
        params: this.commentsQuery,
      });

      this.data = data.data;
    } catch (e) {
      console.error(e);
    }
  };

  @action
  getMoreComments = async () => {
    this.commentsQuery.page = parseInt(this.commentsQuery.page) + 1;
    try {
      const { data } = await API.bbs.get(`/comments`, {
        params: this.commentsQuery,
      });

      this.data.content = this.data.content.concat(data.data.content);
    } catch (e) {
      console.error(e);
    }
  };
  /**
   * reset comments data
   */
  resetComments = () => {
    this.data = Object.assign({}, this.defaultData);
  };

  validateCommentParams = (params = this.defaultCommentParams) => {
    let errMsg = null;

    // 이미지도 없는데 텍스트도 없다면 등록 불가능
    if (_.isEmpty(params.imageList) && _.isEmpty(params.contents)) {
      errMsg = '댓글 내용을 입력하세요';
    }

    if (!errMsg) {
      return true;
    } else {
      this.root.alert.showAlert(errMsg);
      return false;
    }
  };

  /**
   * 코멘트 생성, 수정에 사용할 데이터 생성. 밸리데이션을 포함한다
   */
  makeCommentBody = (params = this.defaultCommentParams) => {
    if (this.validateCommentParams(params)) {
      const body = {};

      const {
        communityBbsId,
        contents,
        imageList,
        isSubComment,
        originCommentId,
        parentCommentId,
      } = params;

      _.merge(body, {
        communityBbsId,
        contents,
        imageList: Array.isArray(imageList) ? imageList : [],
      });

      // 대댓글
      if (isSubComment) {
        if (!_.isNil(originCommentId)) {
          _.merge(body, {
            originCommentId,
          });
        }

        if (!_.isNil(parentCommentId)) {
          _.merge(body, {
            parentCommentId,
          });
        }
      }

      return body;
    } else {
      return null;
    }
  };

  createComment = async ({
    params = this.defaultCommentParams,
    onSuccess = () => {},
  }) => {
    const body = this.makeCommentBody(params);

    if (!_.isNil(body)) {
      try {
        await API.bbs.post(`/comments`, body);

        await this.getComments(this.commentsQuery);

        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } catch (e) {
        this.root.alert.showAlert('오류가 발생했습니다.');
        console.error(e);
      }
    }
  };

  /**
   * 코멘트 수정
   */
  updateComment = async ({
    id = 0,
    params = this.defaultCommentParams,
    onSuccess = () => {},
  }) => {
    const body = this.makeCommentBody(params);

    if (!_.isNil(body)) {
      try {
        await API.bbs.put(`/comments/${id}`, body);

        await this.getComments(this.commentsQuery);

        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } catch (e) {
        this.root.alert.showAlert('오류가 발생했습니다.');
        console.error(e);
      }
    }
  };

  /**
   * 코멘트 삭제
   */
  deleteComment = async ({ id = 0 }) => {
    if (!_.isNil(id)) {
      try {
        await API.bbs.delete(`/comments/${id}`);
        await this.getComments(this.commentsQuery);

        await this.root.bbs.myBBS.getMyActivity();
      } catch (e) {
        this.root.alert.showAlert('오류가 발생했습니다.');
        console.error(e);
      }
    }
  };

  /**
   * 코멘트 작성 시간 포맷
   *
   *  n분전 (1시간 이내)
      n시간전 (1시간 이후 ~ 24시간 이내)
      M월 D일 (하루 이전 같은 연도)
      YYYY년 M월 D일 (이전 해)

   *  @param option.currentTimestamp 현재 시간 타임스탬프
   *  @param option.createdTimestamp 생성 시간 타임스탬프
   */
  getCreatedTimeWithFormat = ({ current, created } = {}) => {
    const MINUTE_IN_MS = 1000 * 60;
    const HOUR_IN_MS = MINUTE_IN_MS * 60;
    const DAY_IN_MS = HOUR_IN_MS * 24;

    const currentMoment = moment(current);
    const createdMoment = moment(created);

    const currentTS = currentMoment.format('x');
    const createdTS = createdMoment.format('x');

    // 밀리세컨드 단위 시간치
    const timeDiffInMs = currentTS - createdTS;

    // 작성 1분 이내
    if (timeDiffInMs < MINUTE_IN_MS) {
      return `조금 전`;
    }
    // 작성 1시간 이내
    else if (timeDiffInMs < HOUR_IN_MS) {
      return `${parseInt(timeDiffInMs / MINUTE_IN_MS, 10)}분 전`;
    }
    // 작성 24시간 이내
    else if (timeDiffInMs < DAY_IN_MS) {
      return `${parseInt(timeDiffInMs / HOUR_IN_MS, 10)}시간 전`;
    }
    // 24시간 이상 전
    else if (timeDiffInMs > DAY_IN_MS) {
      const currentYear = currentMoment.year();
      const createdYear = createdMoment.year();
      const isSameYear = currentYear === createdYear;

      // 올해 작성한 글
      if (isSameYear) {
        return createdMoment.format(`M월 D일`);
      } else {
        return createdMoment.format(`YYYY년 M월 D일`);
      }
    }
  };

  /**
   * 게시글 좋아요
   * TODO: user API에서 스펙 확인
   */
  @action
  addLikeComment = async ({ commentId } = {}) => {
    if (this.root.login.isLoggedIn) {
      try {
        await userLikeService.saveUserLike({
          userId: this.root.user.userId,
          target: bbsTargetTypes.COMMENT,
          targetId: commentId,
        });

        this.getComments(this.commentsQuery);
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
  removeLikeComment = async ({ commentId } = {}) => {
    try {
      await userLikeService.deleteUserLike({
        userId: this.root.user.userId,
        target: bbsTargetTypes.COMMENT,
        targetId: commentId,
      });

      this.getComments(this.commentsQuery);
    } catch (e) {
      console.error(e);
    }
  };
}

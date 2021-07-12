import { observable, action, computed } from 'mobx';
import { isBrowser } from 'lib/common/isServer';
import API from 'lib/API';
import _ from 'lodash';
import isFunction from 'lib/common/isFunction';
import { default as reportTargetEnum } from 'lib/constant/reportTarget';

class ReportStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable
  isReportTypeFetched = false;

  /**
   * 사용 가능한 모든 신고 유형 (ex. 상품정보 다름(가격 및 옵션), 가품, ...)
   *
   *  {
        targets: [],
        description: '',
        name: '',
      }
   */
  @observable
  reportTypes = [];

  @action
  setReportTypes = (a) => {
    this.reportTypes = a;
  };

  /**
   * 리포트 타입 객체 배열 가져오기. 1번만 가져오면 된다
   */
  @action
  getReportTypes = async ({ onSuccess = () => {} } = {}) => {
    try {
      // 신고 유형 데이터가 없으면 서버에서 가져온 후 onSuccess 실행
      if (!this.isReportTypeFetched) {
        const { data } = await API.claim.get(`/users/report/report-types`);
        this.reportTypes = data.data;
        this.isReportTypeFetched = true;
        onSuccess();
      } else {
        onSuccess();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 상품 신고 유형
  @computed
  get productReportTypes() {
    return this.reportTypes.filter((type) =>
      type.targets?.includes(reportTargetEnum.PRODUCT)
    );
  }

  // 회원 신고 유형
  @computed
  get userReportTypes() {
    return this.reportTypes.filter((type) =>
      type.targets?.includes(reportTargetEnum.USER)
    );
  }

  // 게시글 신고 유형
  @computed
  get boardReportTypes() {
    return this.reportTypes.filter((type) =>
      type.targets?.includes(reportTargetEnum.BOARD)
    );
  }

  // 댓글 신고 유형
  @computed
  get commentReportTypes() {
    return this.reportTypes.filter((type) =>
      type.targets?.includes(reportTargetEnum.COMMENT)
    );
  }

  // 리뷰 신고 유형
  @computed
  get reviewReportTypes() {
    return this.reportTypes.filter((type) =>
      type.targets?.includes(reportTargetEnum.REVIEW)
    );
  }

  getReportTypeOptions = (reportTarget) => {
    // 서버 신고 유형을 컴포넌트에 사용할 수 있는 객체 형태로 변경
    const mapReportTypeToOption = (type) => ({
      label: type.description,
      value: type.name,
    });

    switch (reportTarget) {
      case reportTargetEnum.PRODUCT:
        return this.productReportTypes.map(mapReportTypeToOption);

      case reportTargetEnum.BOARD:
        return this.boardReportTypes.map(mapReportTypeToOption);

      case reportTargetEnum.COMMENT:
        return this.commentReportTypes.map(mapReportTypeToOption);

      case reportTargetEnum.USER:
        return this.userReportTypes.map(mapReportTypeToOption);

      case reportTargetEnum.REVIEW:
        return this.reviewReportTypes.map(mapReportTypeToOption);

      default:
        break;
    }
  };

  /**
   * 신고 접수
   */
  createReport = async ({ params = {}, onSuccess = () => {} }) => {
    const body = {
      reportTarget: params.reportTarget, // 신고 대상. 상품,게시글, 댓글, 회원 4개 중 하나
      reportType: params.reportType, // 신고 유형. API로 가져오는 20여개 객체 데이터 중 하나
      reporter: this.root.user.userId, // 신고자 id. userStore에서 가져옴
      targetId: params.targetId, // 게시글이면 게시글 id, 코멘트면 코멘트 id, 회원 id, ...
      title: params.title, // 신고양식  입력 제목
      content: params.content, // 신고양식 내용
      imageUrls: params.imageUrls, // 신고양식 첨부 이미지 URL 배열. 이미지 업로드 후
    };

    const validationMessage = this.validateReportData(body);

    if (validationMessage === true) {
      try {
        await API.claim.post(`/users/report`, body);
        this.root.alert.showAlert('신고가 접수되었습니다');

        if (isFunction(onSuccess)) {
          onSuccess();
        }
      } catch (e) {
        this.root.alert.showAlert('오류가 발생했습니다');
        console.error(e);
      }
    } else {
      this.root.alert.showAlert(validationMessage);
    }
  };

  validateReportData = (reportData) => {
    if (!reportData.reportType) {
      return '신고 유형을 선택하세요';
    }
    if (!reportData.title) {
      return '제목을 입력하세요';
    }
    if (!reportData.content) {
      return '내용을 입력하세요';
    }

    return true;
  };
}

export default ReportStore;

import { observable, action, toJS } from 'mobx';
import API from 'childs/lib/API';
import { isBrowser } from 'childs/lib/common/isServer';
import { devLog } from 'childs/lib/common/devLog';
import Form from 'stores/form-store/_.forms';
import luckyDrawService from 'childs/lib/API/product/luckyDrawService';
import widerplanetTracker from 'childs/lib/tracking/widerplanet/widerplanetTracker';

export default class LukcyDrawStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable user;
  @observable luckydrawLoginModal = false;
  @observable luckydrawSignupModal = false;
  @observable luckydrawModifyModal = false;
  @observable luckydrawDealId;

  @observable luckyEventData = {};
  @observable luckyPopupIsOpen = true;

  @action
  initLuckyEventData = () => {
    if (localStorage.getItem('lucky-popup')) {
      this.luckyPopupIsOpen = false;
      return;
    }
    const data = {
      // eventTitle: 'lucky_popup',
      imgUrl: '/static/event/lucky_popup.png',
    };
    this.luckyEventData = data;
  };

  @action
  handleLuckyPopupClose = stop => {
    if (stop) {
      localStorage.setItem('lucky-popup', 'stop');
    }
    this.luckyPopupIsOpen = false;
  };

  @action
  setLuckydrawLoginModal = bool => {
    if (bool === true) {
      this.root.login.loginPosition = '';
    }
    this.luckydrawLoginModal = bool;
  };

  @action
  setLuckydrawSignupModal = bool => {
    if (bool !== true) {
      this.root.login.loginPosition = '';
    }

    this.luckydrawSignupModal = bool;
  };

  @action
  setLuckydrawModifyModal = bool => {
    if (bool !== true) {
      this.root.login.loginPosition = '';
    }

    this.luckydrawModifyModal = bool;
  };

  @action
  getEventUser = () => {
    let form = Form.modifyLuckydraw;
    form.clear();
    form.$('emailCheck').set('label', '중복확인');
    form.$('authMobileButton').set('label', '본인인증');

    API.user.get(`/event/users`).then(res => {
      this.user = res.data.data;
      devLog('toJS(this.user)', toJS(this.user));
      let identityVerify = this.user.identityVerify;
      let handleModify = false;
      let acceptTerms = this.user.acceptTerms;
      let agreeSaleTos = acceptTerms.agreeSaleTos;
      let agreeEmailReception = acceptTerms.agreeEmailReception;
      let agreeSmsReception = acceptTerms.agreeSmsReception;
      let emailVerified = this.user.emailVerified;
      let validEmail = this.user.validEmail;

      if (
        agreeSaleTos === true &&
        agreeEmailReception === true &&
        agreeSmsReception === true &&
        !!validEmail &&
        identityVerify?.identityVerifyMethod === 'MOBILE'
      ) {
        handleModify = true;
      }

      // API 호출을 통한 회원 정보 수정 로직 진입
      if (!!handleModify) {
        this.requestLuckyDraws({ dealId: this.luckydrawDealId });
      } else {
        this.luckydrawModifyModal = true;
        // 로직을 위한 기본 사항 바인딩
        if (!!validEmail) {
          form.$('emailOriginal').set('value', this.user.email);
          form.$('email').set('value', this.user.email);
          form.$('emailCheck').set('label', '인증완료');
          form.$('emailCheck').set('value', 'complete');
        }

        form.$('emailVerified').set('value', this.user.emailVerified);

        form
          .$('verifiedIdentityUpdated')
          .set('value', this.user.verifiedIdentityUpdated);

        // 약관 동의 바인딩

        form.$('agreeSaleTos').set('value', agreeSaleTos);
        form.$('agreeEmailReception').set('value', agreeEmailReception);
        form.$('agreeSmsReception').set('value', agreeSmsReception);

        // 이메일 인증 바인딩
        if (!!emailVerified) {
          form.$('email').set('disabled', true);
        }

        // 본인인증 바인딩
        if (identityVerify?.identityVerifyMethod === 'MOBILE') {
          form.$('name').set('value', identityVerify.name);
          form.$('mobile').set('value', identityVerify.mobile);
          form.$('gender').set('value', identityVerify.gender);
          form.$('diCode').set('value', identityVerify.diCode);
          form.$('diCodeOriginal').set('value', identityVerify.diCode);
          form.$('birth').set('value', identityVerify.birth);
          form.$('authMobileButton').set('label', '인증완료');
          form.$('authMobileButton').set('value', 'complete');
        }
      }

      this.root.login.loginPosition = '';
    });
  };
  @observable
  luckyDrawData = {
    // titleList: [
    //   {
    //     title: '[변경금지] 럭키드로우 테스트 상품2',
    //     titleImageUrl: '',
    //     requestFromAt: 1573538400000,
    //   },
    // ],
    // luckyDrawList: [
    //   {
    //     title: '[변경금지] 럭키드로우 테스트 상품2',
    //     imageUrl: '',
    //     dealId: 23880,
    //     sellPrice: 50000.0,
    //     discountPrice: 45000.0,
    //     discountRate: 10,
    //     now: 1573568131,
    //     requestFromAt: 1573538400000,
    //     requestToAt: 1573624800000,
    //     remainedTimeForStart: -29731,
    //     remainedTimeForEnd: 56668,
    //     winnerAnnouncementAt: 1573628400000,
    //     remainedTimeForWinnerAnnouncement: 60268,
    //     winnerBuyFromAt: 1573628400000,
    //     winnerBuyToAt: 1573714800000,
    //     statusCode: 'START',
    //     statusText: '응모하기',
    //   },
    // ],
  };
  @observable isRequestModal = false;
  @observable requestedData = {
    // dealId: 24837
    // discountPrice: 50000
    // discountRate: 50
    // imageUrl: "https://d3ikprf0m31yc7.cloudfront.net/images/deals/luckydraw/0a34c34bc5c24c8fac9888c03e4a412c.png"
    // now: 1573708426
    // remainedTimeForEnd: 2773
    // remainedTimeForStart: -83626
    // remainedTimeForWinnerAnnouncement: 6373
    // requestFromAt: 1573624800000
    // requestToAt: 1573711200000
    // sellPrice: 100000
    // statusCode: "REQUESTED"
    // statusText: "응모완료"
    // title: "[변경금지] 럭키드로우 테스트 상품4"
    // winnerAnnouncementAt: 1573714800000
    // winnerBuyFromAt: 1573714800000
    // winnerBuyToAt: 1573801200000
  };

  @observable isResultModal = false;
  @observable resultData = {};

  @action
  getLuckyDrawList = async () => {
    try {
      const { data } = await luckyDrawService.getLuckyDraws();
      devLog('getLuckyDraws', data?.data);
      this.luckyDrawData = data?.data;
    } catch (e) {
      console.error(e);
    }
  };

  // 로딩스피너 표시를 위한 플래그
  @observable isOnRequest = false;

  /**
   * 응모하기 버튼 클릭
   */
  requestLuckyDraws = async ({ dealId }) => {
    try {
      const { data } = await luckyDrawService.requestLuckyDraws({ dealId });

      devLog(data, '응모 완료');
      this.requestedData = data.data;
      this.isRequestModal = true;

      // 럭키드로우 목록 새로고침.
      // 로그인한 상태라면 본인의 응모 완료 여부가 업데이트된다.
      await this.getLuckyDrawList();

      // 와이더플래닛 트래커
      widerplanetTracker.applicationComplete({
        userId: this.root.user.userId,
      });
    } catch (e) {
      // TODO: 에러 케이스에 따라 프로세스 진행
      this.root.alert.showAlert(e.data?.message || '오류가 발생했습니다.');
      console.error(e);
    }
  };

  /**
   * 당첨자 확인
   */
  checkWinnerLuckyDraws = async ({ dealId }) => {
    try {
      const { data } = await luckyDrawService.checkWinnerLuckyDraws({ dealId });

      // TODO: 확인 모달 연결
      this.isResultModal = true;
      this.resultData = data.data;
    } catch (e) {
      this.root.alert.showAlert(e.data?.message || '오류가 발생했습니다.');
      console.error(e);
    }
  };

  /**
   * 모달 닫기
   */
  @action
  closeModal = () => {
    this.isRequestModal
      ? (this.isRequestModal = false)
      : (this.isResultModal = false);

    console.log(this.isRequestModal, this.isResultModal, 'this.isResultModal ');
  };
}

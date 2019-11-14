import { observable, action } from 'mobx';
import { isBrowser } from 'lib/isServer';
import { devLog } from 'lib/devLog';
import luckyDrawService from 'lib/API/product/luckyDrawService';

export default class LukcyDrawStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

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

  /**
   * 응모하기 버튼 클릭
   */
  requestLuckyDraws = async ({ dealId }) => {
    try {
      await luckyDrawService.requestLuckyDraws({ dealId });

      // TODO: 신청 모달 연결
      this.root.alert.showAlert('럭키드로우 신청되었습니다.');

      // 럭키드로우 목록 새로고침.
      // 로그인한 상태라면 본인의 응모 완료 여부가 업데이트된다.
      await this.getLuckyDrawList();
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
      this.root.alert.showAlert(JSON.stringify(data.data));
    } catch (e) {
      this.root.alert.showAlert(e.data?.message || '오류가 발생했습니다.');
      console.error(e);
    }
  };
}

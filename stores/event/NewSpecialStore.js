import { observable, action, computed } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import { isEmpty as _isEmpty, get as _get } from 'lodash';
import { dateFormat } from 'lib/constant';
import moment from 'moment';

class SpecialStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }

    if (initialState.newSpecial) {
      this.eventId = initialState.newSpecial.eventId;
      this.specialDetail = initialState.newSpecial.specialDetail;
    }
  }

  /**
   * observables
   */
  @observable isLoading = false;
  @observable isInitial = true;
  @observable eventId = NaN;
  @observable specialDetail = {};

  /**
   * computeds
   */
  @computed get headData() {
    return {
      pageName: this.specialDetail.detailTitle,
      description: `구하다 기획전 "${this.specialDetail.detailTitle}". ${moment(
        this.specialDetail.startDate
      ).format(`${dateFormat.YYYYMMDD_UI} 부터`)} ${
        !!this.specialDetail.endDate
          ? moment(this.specialDetail.endDate).format(
              `${dateFormat.YYYYMMDD_UI} 까지`
            )
          : ''
      }`,
      image: _get(this.specialDetail, 'mediumImageUrl'),
    };
  }

  /**
   * actions
   */
  @action async fetchSpecialDetail(eventId = this.eventId) {
    if (
      this.root.searchByFilter.deals.length &&
      (!eventId || (!_isEmpty(this.specialDetail) && this.eventId === eventId))
    ) {
      return;
    }

    this.isInitial = false;
    this.isLoading = true;

    this.root.searchByFilter.initializeSearch({
      eventIds: [eventId],
    });

    this.eventId = eventId;

    try {
      const {
        data: { data },
      } = await API.settle.get(`/plan/list/detail?eventId=${eventId}`);

      this.specialDetail = data;
    } catch (error) {
      console.error(error.message);
      this.specialDetail = {};
    }

    this.isLoading = false;
  }

  @action resetSpecialData() {
    this.isInitial = true;
    this.eventId = NaN;
    this.specialDetail = {};
    this.root.searchByFilter.resetData();
  }
}

export default SpecialStore;

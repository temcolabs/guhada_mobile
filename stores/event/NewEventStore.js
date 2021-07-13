import { observable, action, computed } from 'mobx';
import API from 'lib/API';
import { isBrowser } from 'lib/common/isServer';
import _ from 'lodash';
import { dateFormat } from 'lib/constant';
import moment from 'moment';

class EventStore {
  constructor(root, initialState) {
    if (isBrowser) {
      this.root = root;
    }

    if (initialState.newEvent) {
      this.eventId = initialState.newEvent.eventId;
      this.eventDetail = initialState.newEvent.eventDetail;
    }
  }

  /**
   * observables
   */
  @observable isLoading = false;
  @observable isInitial = true;
  @observable eventId = NaN;
  @observable eventDetail = {};

  /**
   * computeds
   */
  @computed get headData() {
    return {
      pageName: this.eventDetail.eventTitle,
      description: `구하다 이벤트 "${this.eventDetail.eventTitle}". ${moment(
        this.eventDetail.eventStartDate
      ).format(`${dateFormat.YYYYMMDD_UI} 부터`)} ${
        !!this.eventDetail.eventEndDate
          ? moment(this.eventDetail.eventEndDate).format(
              `${dateFormat.YYYYMMDD_UI} 까지`
            )
          : ''
      }`,
      image: _.get(this.eventDetail, 'imgUrlM'),
    };
  }

  /**
   * actions
   */
  @action async fetchEventDetail(eventId = this.eventId) {
    if (
      !eventId ||
      (!_.isEmpty(this.eventDetail) && this.eventId === eventId)
    ) {
      return;
    }

    this.isInitial = false;
    this.isLoading = true;

    this.eventId = eventId;

    try {
      const {
        data: { data },
      } = await API.settle.get(`/event/list/detail?eventId=${eventId}`);

      this.eventDetail = data;
    } catch (error) {
      console.error(error.message);
      this.eventDetail = {};
    }

    this.isLoading = false;
  }

  @action resetEventData() {
    this.isInitial = true;
    this.eventId = NaN;
    this.eventDetail = {};
  }
}

export default EventStore;

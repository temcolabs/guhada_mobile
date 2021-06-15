import { observable, action } from 'mobx';
import API from 'childs/lib/API';

export default class GiftStore {
  /**
   * observables
   */
  @observable isLoading = true;

  @observable recommendDeals = [];

  @observable bestDeals = [];

  /**
   * actions
   */
  @action fetchDeals = async () => {
    if (!this.recommendDeals.length || !this.bestDeals.length) {
      this.isLoading = true;
      try {
        const { data } = await API.search('/ps/main-home/deals/guhada-gift');
        const dealsArray = data.data;

        if (dealsArray.length) {
          this.recommendDeals = dealsArray[0].deals;
          if (dealsArray.length >= 2) {
            this.bestDeals = dealsArray[1].deals;
          }
        }
      } catch (error) {
        console.error(error.message);
      }
      this.isLoading = false;
    }
  };
}

import { observable, action } from 'mobx';
import API from 'childs/lib/API';

export default class GiftStore {
  @observable recommendDeals = [];

  @observable bestDeals = [];

  @action
  fetchDeals = async () => {
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
  };
}

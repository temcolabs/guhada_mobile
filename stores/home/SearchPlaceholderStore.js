import { observable, action } from 'mobx';
import placeholderService from 'childs/lib/API/settle/placeholderService';

export class SearchPlaceholderStore {
  // constructor() {
  //   this.getPlaceholder();
  // }

  @observable placeholderData;
  @action
  getPlaceholder = () => {
    placeholderService.getSearchPlaceholder().then(res => {
      this.placeholderData = res.data;
    });
  };
}

export default SearchPlaceholderStore;

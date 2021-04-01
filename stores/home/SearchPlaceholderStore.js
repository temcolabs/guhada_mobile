import { observable, action } from 'mobx';
import placeholderService from 'childs/lib/API/settle/placeholderService';

export class SearchPlaceholderStore {
  // constructor() {
  //   this.getPlaceholder();
  // }

  @observable placeholderData;
  @observable placeHolderClone;
  @action
  getPlaceholder = () => {
    placeholderService.getSearchPlaceholder().then(res => {
      this.placeholderData = res.data?.data;
      this.placeHolderClone = res.data?.data.placeholder;
    });
  };
}

export default SearchPlaceholderStore;

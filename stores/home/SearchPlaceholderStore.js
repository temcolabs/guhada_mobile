import { observable, action } from 'mobx';
import placeholderService from 'lib/API/settle/placeholderService';

export class SearchPlaceholderStore {
  // constructor() {
  //   this.getPlaceholder();
  // }

  @observable placeholderData;
  @observable placeHolderClone;

  // Main Images
  @observable mainImageSetOneSetList;
  @observable mainImageSetTwoSetList;
  @observable mainImageSetThreeList;
  @observable mainImageSetFourList;

  @action
  getPlaceholder = () => {
    placeholderService.getSearchPlaceholder().then((res) => {
      this.placeholderData = res.data?.data;
      this.placeHolderClone = res.data?.data.placeholder;
      this.mainImageSetOneSetList = res.data?.data.mainImageSetOneSetList;
      this.mainImageSetTwoSetList = res.data?.data.mainImageSetTwoSetList;
      this.mainImageSetThreeList = res.data?.data.mainImageSetThreeList;
      this.mainImageSetFourList = res.data?.data.mainImageSetFourList;
    });
  };
}

export default SearchPlaceholderStore;

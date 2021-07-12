import { observable, action, toJS } from 'mobx';
import { searchCategoryName, getCategory } from '../utils';
import API from 'lib/API';

export default class CategoryStore {
  @observable category = [];
  @observable categoryStatus = false;
  @observable hover = false;

  @observable searchCategoryList = [];

  // constructor() {
  // this.getCategory();
  // }

  @action setHoverInit = () => {
    this.hover = true;
  };

  @action setHoverFalse = () => {
    this.hover = false;
  };

  @action setCategory = (category) => {
    this.category = [];
    this.category = category;
  };

  @action
  getCategory() {
    if (this.category.length === 0) {
      API.search
        .get('/ps/search/all')
        .then((res) => {
          this.setCategory(res.data.data.categories);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  @action
  searchCategory = (title) => {
    var regexp = /^[가-힣\*]+$/;
    var checkTitle = regexp.test(title);
    if (checkTitle && title.length >= 2) {
      this.searchCategoryList = searchCategoryName(this.category, title);
    }
  };

  @action
  initSearchCategoryList = () => {
    this.searchCategoryList = [];
  };

  @observable categoryList = [];

  @action
  returnCategory = (id) => {
    this.categoryList = [];
    // if (this.category.length === 0) {
    //   API.search
    //     .get('/ps/search/all')
    //     .then(res => {
    //       this.categoryList = getCategory(res.data.data.categories, id);
    //       this.setCategory(res.data.data.categories);
    //     })
    //     .catch(e => {
    //       console.error(e);
    //     });
    // } else {
    this.categoryList = getCategory(this.category, id);
    // }
  };
}

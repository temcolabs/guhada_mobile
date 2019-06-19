import Axios from 'axios';
import { observable, action, computed, runInAction, toJS } from 'mobx';
import { searchCategoryName } from '../utils';
import API from 'lib/API';

export default class CategoryStore {
  @observable category = [];
  @observable categoryWomen = [];
  @observable categoryMen = [];
  @observable categoryKids = [];
  @observable categoryStatus = false;
  @observable hover = false;

  @observable searchCategoryList = [];

  constructor() {
    this.getCategory();
  }

  @action setHoverInit = () => {
    this.hover = true;
  };

  @action setHoverFalse = () => {
    this.hover = false;
  };

  @action setCategory = category => {
    this.category = category;
    this.categoryWomen = category[0].children;
    this.categoryMen = category[1].children;
    this.categoryKids = category[2].children;
  };

  @action
  getCategory() {
    this.category = [];

    API.cloud.get('/guhada_category.json').then(res => {
      // console.log(res);
      this.setCategory(res.data);
    });
  }

  @action
  searchCategory = title => {
    var regexp = /^[가-힣\*]+$/;
    var checkTitle = regexp.test(title);
    if (checkTitle && title.length >= 2) {
      this.searchCategoryList = searchCategoryName(this.category, title);
    }
    console.log(toJS(this.searchCategoryList));
  };

  @action
  initSearchCategoryList = () => {
    console.log('blur');
    this.searchCategoryList = [];
  };
}

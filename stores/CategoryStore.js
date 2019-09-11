import Axios from 'axios';
import { observable, action, computed, runInAction, toJS } from 'mobx';
import { searchCategoryName, searchTreeId, getCategory } from '../utils';
import API from 'lib/API';

export default class CategoryStore {
  @observable category = [];
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
  };

  @action
  getCategory() {
    this.category = [];

    API.search
      .get('/ps/search/all')
      .then(res => {
        this.setCategory(res.data.data.categories);
      })
      .catch(e => {
        console.error(e);
      });

    // API.product.get('/categories').then(res => {
    //   this.setCategory(res.data.data);
    // });
  }

  @action
  searchCategory = title => {
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
  returnCategory = id => {
    this.categoryList = [];

    if (this.category.length === 0) {
      API.search
        .get('/ps/search/all')
        .then(res => {
          this.categoryList = getCategory(res.data.data.categories, id);
        })
        .catch(e => {
          console.error(e);
        });

      // API.product.get('/categories').then(res => {
      //   let category = res.data;
      //   this.categoryList = getCategory(category, id);
      // });
    } else {
      this.categoryList = getCategory(this.category, id);
    }
  };
}

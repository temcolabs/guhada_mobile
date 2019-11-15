import { observable, action, computed, toJS } from 'mobx';
import Axios from 'axios';
import {
  getCategoryKeyArray,
  searchTreeId,
  getCategoryChildren,
  getCategory,
} from '../utils.js';
import Router from 'next/router';
import API from 'childs/lib/API';

export default class SearchStore {
  @observable category = '';
  @observable title = '';
  @observable keyArray;

  @observable treeData = [];
  @observable expandedKeys = [];
  @observable selectedKeys = [''];
  @observable autoExpandParent = true;
  @observable categoryTreeData;
  @observable currentCategory;
  @observable checkedKeys = [];

  @observable categoryStatus = false;

  constructor() {
    this.getCategoryData();
  }

  @action setCategoryData = category => {
    this.treeData = category;
    this.productCategoryData = category;
    this.categoryStatus = true;
  };

  @action
  getCategoryData() {
    API.product.get('/categories').then(res => {
      this.setCategoryData(res.data.data);
    });
  }

  @action
  findTreeData = () => {
    this.setKeyArray(getCategoryKeyArray(this.treeData, this.category));
    this.setCategoryTreeData();
  };

  @action
  setCategory = data => {
    this.category = data;
  };

  @action
  setTitle = data => {
    this.title = data;
  };

  @action
  setKeyArray = data => {
    this.keyArray = data;
  };

  @computed get getKeyArray() {
    return this.keyArray;
  }

  @computed get getCategory() {
    return this.category;
  }

  @action
  onExpand = (expandedKeys, info) => {
    Router.push({
      pathname: '/search',
      query: { category: info.node.props.id },
    });
  };

  @action
  onCheck = (checkedKeys, info) => {
    this.checkedKeys = checkedKeys;
  };

  @action
  onSelect = (selectedKeys, info) => {
    this.setTitle(info.node.props.title);
    this.onCheck(selectedKeys);

    Router.push({
      pathname: '/search',
      query: { categoryId: info.node.props.id },
    });
  };

  @action
  setExpandedKeys = expandedKeys => {
    const idx = this.expandedKeys.indexOf(expandedKeys);

    if (idx === -1) this.expandedKeys.push(expandedKeys);
    else this.expandedKeys.splice(idx, 1);
  };

  @action
  setCurrentCategory = currentCategory => {
    this.currentCategory = currentCategory;
  };

  @action
  setSeletedKeys = selectedKeys => {
    this.selectedKeys = selectedKeys;
  };

  // setCategoryTreeData = keyArray => {
  //   this.categoryTreeData =
  //     treeData[keyArray[1]].children[keyArray[2]].children;
  // };

  @action
  setCategoryTreeData = treeData => {
    this.categoryTreeData = treeData;
  };

  @action
  setKeyArray = data => {
    this.keyArray = data;
  };

  @computed get getSelectedKeys() {
    return this.selectedKeys.slice();
  }

  @computed get getCheckedKeys() {
    return this.checkedKeys.slice();
  }
  @computed get getExpandedKeys() {
    return this.expandedKeys.slice();
  }

  @computed get dataTree() {
    return toJS(this.categoryTreeData);
  }

  @observable productCategoryData = [];
  @observable categoryDataKey = [0, 0, 0, 0];
  @observable categoryDataKeyTitle = ['', '', '', ''];
  @observable categoryDataTitle = '';

  @action
  findCategoryData = key => {
    return getCategory(toJS(this.productCategoryData), key);
  };

  @action
  findCategoryDataList = key => {
    return getCategoryChildren(toJS(this.productCategoryData), key);
  };

  @action
  initCategoryDataKey = () => {
    this.categoryDataKey = [0, 0, 0, 0];
  };

  @action
  setCategoryKey = (id, depth, fullDepthName) => {
    for (let i = 0; i < this.categoryDataKey.length; i++) {
      if (depth < i) {
        this.categoryDataKey[i] = 0;
        this.categoryDataTitle = '';
      } else {
        this.categoryDataKey[depth] = id;
        this.categoryDataKeyTitle[depth] = fullDepthName;
        this.categoryDataTitle = fullDepthName;
      }
    }
  };

  @action
  setCategoryDataKey = (hierarchy, fullDepthName) => {
    this.categoryDataTitle = fullDepthName;
    this.categoryDataKey = hierarchy.split(',');
    // this.findCategoryDataTitle();
  };
}

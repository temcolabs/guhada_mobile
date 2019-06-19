import { observable, action, computed, toJS, extendObservable } from 'mobx';
import {
  getCategoryTitle,
  getCategoryKeyArray,
  getCategory,
  getParameterByName,
  getCategoryKey,
  searchTreeId,
  getBrandTitle,
} from '../utils.js';
import Router from 'next/router';
import API from 'lib/API.js';
const isServer = typeof window === 'undefined';

export default class SearchItemStore {
  @observable treeData = [];
  @observable item = [];
  @observable itemStatus = false;

  @observable hover = [false, false, false];

  @action
  toggleHover = i => {
    let hoversState = this.hover;
    hoversState[i] = true;

    this.hover = hoversState;
  };

  @action
  leaveHover = () => {
    this.hover = [false, false, false];
  };

  constructor(root) {
    if (!isServer) this.root = root;

    // if (this.root) console.log(this.root);
    // this.getTreeDataForFilter();
  }

  @action
  setItem = item => {
    this.item = item;
  };

  @observable treeDataForFilter;
  @observable catidx;

  @action
  getTreeDataForFilter = () => {
    API.search.get('/ps/search/all').then(res => {
      let data = res.data;

      if (data.resultCode === 200) {
        this.treeDataForFilter = data.data.categories;
      }
    });
  };

  @action
  getItem = () => {
    API.product.get('/deals').then(res => {
      let data = res.data;
      // console.log(res);
      if (data.resultCode === 200) {
        // console.log("200");
        this.setItem(data.data);

        this.itemStatus = true;
      }
    });
  };

  @action
  getsearchitem = query => {
    API.search.get('/ps/search?searchQuery=' + query).then(res => {
      let data = res.data;
      // console.log(res);
      if (data.resultCode === 200) {
        this.setItem(data.data);

        this.itemStatus = true;
        Router.push({
          pathname: '/search',
          query: { searchQuery: query },
        });
      }
    });
  };

  @action
  getSearchByBrandId = (brandId, unitPerPage) => {
    API.search.get('/ps/search/brand/' + brandId).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.setItem(data.data);
        // this.pageNavigator(data.data.countOfDeals, unitPerPage);
        this.itemStatus = true;
        // Router.push("/search?brand=" + brandId);
      }
    });
  };

  @observable searchOrderFilter = 'DATE';

  @action
  setSearchOrderFilter = order => {
    this.searchOrderFilter = order;
  };

  @observable locationFilter;
  @observable locationHierarchy = [];
  @observable locationGuide = [];
  @observable locationKey = [];
  @action
  LocationGuide = value => {
    this.locationKey = [];
    let key = toJS(this.locationHierarchy.key);
    this.locationKey = key.split('-').map(Number);
    // console.log(toJS(this.locationKey));
    // console.log(toJS(this.locationFilter));
    this.locationGuide = [];
    let firstLocationFilter = [];

    this.locationFilter.map(locationFilter => {
      let titleEnglish = '';

      switch (locationFilter.title) {
        case '여성':
          titleEnglish = 'Women';
          break;
        case '남성':
          titleEnglish = 'Men';
          break;
        case '키즈':
          titleEnglish = 'Kids';
          break;
      }
      firstLocationFilter.push({ id: locationFilter.id, title: titleEnglish });
    });
    this.locationGuide.push(firstLocationFilter);

    for (let i = 0; i < this.locationKey.length - 2; i++) {
      if (i === 0)
        this.locationGuide.push(
          this.locationFilter[this.locationKey[1]].children
        );
      if (value !== 'hierarchyCheck') {
        if (i === 1)
          this.locationGuide.push(
            this.locationFilter[this.locationKey[1]].children[
              this.locationKey[2]
            ].children
          );
      }
    }
  };

  @action
  getSearchByUri = (
    brandIds,
    categoryIds,
    page,
    unitPerPage,
    order,
    filterData,
    subcategory,
    enter,
    keyword
  ) => {
    // 값이 undefined 일 때 문제 되는 parameter 값 "" 처리

    if (brandIds === undefined) {
      brandIds = '';
    }
    if (categoryIds === undefined) {
      categoryIds = '';
    }
    if (enter === undefined) {
      enter = '';
    }
    if (keyword === undefined) {
      keyword = '';
    }

    // 일반적인 카테고리 검색을 위해서 전체 카테고리 값을 불러오기 위한 api 콜

    API.search.get('/ps/search/all').then(async res => {
      let data = res.data;
      // console.log(data);
      if (data.resultCode === 200) {
        this.locationFilter = data.data.categories;

        // if (Number.isInteger(categoryIds)) {
        //   this.treeDataForFilter = data.data.categories;
        // } else if (enter === 'brand' || enter === 'keyword') {
        // } else {
        //   this.treeDataForFilter = data.data.categories;
        // }

        if (enter === 'brand' || enter === 'keyword') {
        } else if (Number.isInteger(categoryIds)) {
          this.treeDataForFilter = data.data.categories;
        } else {
          this.treeDataForFilter = data.data.categories;
        }

        let brandList = [];
        if (brandIds) {
          if (brandIds.length > 0 && brandIds[0] != null) {
            brandIds.map(brand => {
              if (brand.id) brandList.push(brand.id);
              else brandList.push(brand);
            });
          }
        }

        let categoryList = [];

        if (subcategory[0] != null) {
          categoryList = [];
          categoryList = JSON.parse('[' + subcategory + ']');

          this.checkedKeys = [];
          this.checkedKeysId = [];

          categoryList.map(category => {
            this.checkedKeys.push(
              getCategoryKey(this.treeDataForFilter, category)
            );
            this.checkedKeysId.push(category);
          });
        } else {
          categoryList.push(categoryIds);
        }

        let filterList = [];

        if (!filterData) {
          filterData = '';
        }

        let filterCount = JSON.parse('[' + filterData + ']');

        if (Array.isArray(toJS(filterCount))) {
          filterCount.map(filter => {
            filterList.push({ filterAttributeId: filter });
          });
        }

        // category uri 값을 통해서 tree의 기본 key 값을 찾아
        // 열어주는 기능

        let hierarchy;
        if (categoryIds) {
          let getTreeData = getCategory(this.treeDataForFilter, categoryIds);
          // console.log(toJS(getTreeData));

          // hierarchy 값 비교해서 같은 값이 2개 이상 나올시에는
          // children[0].key 값을 열어주는 기능

          // 가방, 슈즈 같은 경우에 필요
          if (toJS(getTreeData)) {
            if (getTreeData.children) {
              let hierarchy = JSON.parse(
                '[' + getTreeData.children[0].hierarchy + ']'
              );
              // console.log(hierarchy);
              let hierarchyCheck = false;
              let cnt = 0;
              for (let i = 0; i < hierarchy.length; i++) {
                for (let j = 0; j < hierarchy.length; j++) {
                  if (hierarchy[i] === hierarchy[j]) cnt++;
                }
                if (cnt > 1) hierarchyCheck = true;

                cnt = 0;
              }

              if (hierarchyCheck === true) {
                this.setExpandedKeys(getTreeData.children[0].key);
                this.locationHierarchy = getTreeData.children[0];
                this.LocationGuide('hierarchyCheck');
              } else {
                this.setExpandedKeys(getTreeData.key);
                this.locationHierarchy = getTreeData;
                this.LocationGuide();
              }
            } else {
              this.setExpandedKeys(getTreeData.key);
              this.locationHierarchy = getTreeData;
              this.LocationGuide();
            }

            hierarchy = JSON.parse('[' + getTreeData.hierarchy + ']');
          }
        }

        let query = Router.router.query;

        API.search
          .post(
            '/ps/search/filter?page=' + page + '&unitPerPage=' + unitPerPage,
            {
              brandIds: brandList,
              categoryIds: categoryList,
              filters: filterList,
              searchQueries: keyword === '' ? [] : [keyword],
              searchResultOrder:
                order === null || order === '' ? 'DATE' : order,
            }
          )
          .then(res => {
            let data = res.data;
            if (data.resultCode === 200) {
              this.setItem(data.data);
              // console.log(hierarchy, "hierarchy");
              if (categoryIds)
                this.setTitle(
                  getCategoryTitle(data.data.categories, categoryIds)
                );

              if (enter === 'all') {
                // this.toGetBrandFilter(categoryList);
                // this.root.brands.brandsByCategoryFilter = data.data.brands;
                this.root.brands.setGroupBrandList(data.data.brands);
                let keyArray;

                this.treeDataForFilter.map(treeData => {
                  if (treeData.id === hierarchy[0]) {
                    keyArray = treeData.key.split('-');
                  }
                });

                this.setKeyArray(keyArray);
                this.setCategoryTreeData();
              } else if (enter === 'brand' || enter === 'keyword') {
                // 브랜드에서 category 목록이 없을 경우
                if (categoryList[0] === '') {
                  // this.toGetBrandFilter([]);
                  // this.root.brands.brandsByCategoryFilter = data.data.brands;
                  this.root.brands.setGroupBrandList(data.data.brands);
                  this.treeDataForFilter = data.data.categories;
                  this.setCategoryTreeData('brand');
                  if (enter === 'keyword') {
                    this.setTitle(keyword);
                  } else {
                    let brand = JSON.parse('[' + query.brand + ']');

                    if (brand.length >= 2) {
                      this.setTitle('검색 결과');
                    } else if (brand.length === 0) {
                      this.setTitle('전체 상품');
                    } else {
                      this.setTitle(
                        getBrandTitle(toJS(data.data.brands), query.brand)
                      );
                    }
                  }
                } else if (enter === 'keyword') {
                  console.log('keyword');
                  // this.toGetBrandFilter([]);
                  // this.root.brands.brandsByCategoryFilter = data.data.brands;
                  this.root.brands.setGroupBrandList(data.data.brands);
                  this.treeDataForFilter = data.data.categories;
                  this.setCategoryTreeData('brand');
                  if (enter === 'keyword') {
                    this.setTitle(keyword);
                  } else {
                    let brand = JSON.parse('[' + query.brand + ']');

                    if (brand.length >= 2) {
                      this.setTitle('검색 결과');
                    } else if (brand.length === 0) {
                      this.setTitle('전체 상품');
                    } else {
                      this.setTitle(
                        getBrandTitle(toJS(data.data.brands), query.brand)
                      );
                    }
                  }
                } else {
                  // 브랜드에서 category 목록이 있을 경우
                  // 전체 브랜드 목록을 보여준다.
                  // this.root.brands.brandsByCategoryFilter = data.data.brands;
                  this.root.brands.setGroupBrandList(data.data.brands);
                  this.setKeyArray(
                    getCategoryKeyArray(this.treeDataForFilter, hierarchy[1])
                  );
                  this.setCategoryTreeData('brand');

                  if (enter === 'keyword') {
                    this.setTitle(keyword);
                  } else {
                    let brand = JSON.parse('[' + query.brand + ']');

                    if (brand.length >= 2) {
                      this.setTitle('검색 결과');
                    } else if (brand.length === 0) {
                      this.setTitle('전체 상품');
                    } else {
                      this.setTitle(
                        getBrandTitle(toJS(data.data.brands), query.brand)
                      );
                    }

                    // this.setTitle(
                    //   getCategoryTitle(data.data.categories, categoryIds)
                    // );
                  }
                }
              } else {
                // this.toGetBrandFilter(categoryList);
                // this.root.brands.brandsByCategoryFilter = data.data.brands;
                this.root.brands.setGroupBrandList(data.data.brands);
                // hierarchy === false 서버로부터 온 카테고리 데이타가 없음
                if (hierarchy) {
                  if (hierarchy.length === 1) {
                    console.log(toJS(this.treeDataForFilter));
                    this.setKeyArray(
                      getCategoryKeyArray(this.treeDataForFilter, hierarchy[0])
                    );
                  } else {
                    this.setKeyArray(
                      getCategoryKeyArray(this.treeDataForFilter, hierarchy[1])
                    );
                  }
                }
                this.setCategoryTreeData();
              }
              // else if (enter === "keyword") {
              //   this.treeDataForFilter = data.data.categories;
              //   this.root.brands.brandsByCategoryFilter = data.data.brands;
              //   this.setCategoryTreeData("brand");

              //   if (categoryIds)
              //     this.setTitle(
              //       getCategoryTitle(data.data.categories, categoryIds)
              //     );
              // }

              this.pageNavigator(data.data.countOfDeals, unitPerPage);

              this.filterData = data.data.filters;
              filterList.map(value => {
                this.filterData.map((data, dataKey) => {
                  data.attributes.map((attributes, attributesKey) => {
                    if (attributes.id === value.filterAttributeId) {
                      if (
                        this.filterData[dataKey].attributes[attributesKey]
                          .filter != undefined
                      ) {
                        this.filterData[dataKey].attributes[
                          attributesKey
                        ].filter = !this.filterData[dataKey].attributes[
                          attributesKey
                        ].filter;
                      } else {
                        extendObservable(
                          this.filterData[dataKey].attributes[attributesKey],
                          { filter: true }
                        );
                      }
                    }
                  });
                });
              });

              this.itemStatus = true;
            }
          });
      }
    });
  };

  @action
  toGetBrandFilter = categoryList => {
    API.search
      .post('/ps/search/filter', {
        categoryIds: categoryList,
      })
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.root.brands.brandsByCategoryFilter = data.data.brands;
        }
      });
  };

  @observable itemCountOfDeals;
  @observable unitPerPage = 20;
  @observable pageList = [];

  @action
  pageNavigator = (itemCountOfDeals, unitPerPage) => {
    this.itemCountOfDeals = itemCountOfDeals;
    this.unitPerPage = unitPerPage;
    let listCount = parseInt(this.itemCountOfDeals / this.unitPerPage) + 1;
    this.pageList = [];

    for (let i = 0; i < listCount; i++) {
      this.pageList.push(i + 1);
    }
  };

  @observable countOfDeals;

  @action
  getSearchCountOfDeals = (brandIds, categoryIds) => {
    let brandList = [];
    brandIds.map(brand => {
      if (brand.id) brandList.push(brand.id);
      else brandList.push(brand);
    });

    API.search
      .post('/ps/search/filter', {
        brandIds: brandList,
        categoryIds: [categoryIds],
        filters: [],
        searchQueries: [],
        searchResultOrder: 'DATE',
      })
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.countOfDeals = data.data.countOfDeals;
        }
      });
  };

  @observable categoryTreeData = [];
  @observable expandedKeys = [];
  @observable title = '';
  @observable checkedKeys = [];
  @observable checkedKeysId = [];

  @observable autoExpandParent = true;
  @observable category = '';
  @observable keyArray;
  @observable currentCategory;

  @observable filterCategoryTitle = '';
  @observable filterCategoryList = [];
  // key 값(enter uri)을 받아서 rendering 할 category tree를 만드는 function

  @action
  setCategoryTreeData = key => {
    // console.log(toJS(this.keyArray));
    // console.log(toJS(this.treeDataForFilter));

    if (key === 'brand') {
      let keyArray = ['0', '1', '2'];
      let filterCategory = this.treeDataForFilter;
      let data = [];

      // console.log(toJS(filterCategory));
      filterCategory.map((filterList, i) => {
        data.push([]);
        // console.log(filterList);

        filterList.children.map(filter => {
          data[i].push({
            id: i,
            title: filter.title,
            disabled: true,
            categoryTitle: filterList.title,
          });
          data[i].push({
            id: filter.id,
            title: '전체',
            key: filter.key,
            hierarchy: filter.hierarchy,
          });

          filter.children.map(filterCategory => {
            data[i].push(toJS(filterCategory));
          });
        });
      });

      this.categoryTreeData = data;

      this.filterCategoryList = [];
      for (let i = 0; i < toJS(this.categoryTreeData).length; i++) {
        if (this.categoryTreeData[i][0].categoryTitle === '여성') {
          this.filterCategoryList.push({ id: i, title: 'WOMEN' });
        } else if (this.categoryTreeData[i][0].categoryTitle === '남성') {
          this.filterCategoryList.push({ id: i, title: 'MEN' });
        } else if (this.categoryTreeData[i][0].categoryTitle === '키즈') {
          this.filterCategoryList.push({ id: i, title: 'KIDS' });
        }
      }
    } else if (this.keyArray === undefined) {
    } else if (this.keyArray.length === 2) {
      let filterCategory = this.treeDataForFilter[this.keyArray[1]];
      let data = [];
      filterCategory.children.map(filter => {
        data.push({
          title: filter.title,
          disabled: true,
        });
        data.push({
          id: filter.id,
          title: '전체',
          key: filter.key,
          hierarchy: filter.hierarchy,
        });

        filter.children.map(filterCategory => {
          data.push(filterCategory);
        });
      });

      this.filterCategoryTitle = this.treeDataForFilter[this.keyArray[1]].title;
      this.categoryTreeData = data;
      // console.log(data);
    } else {
      let filterCategory = this.treeDataForFilter[this.keyArray[1]].children[
        this.keyArray[2]
      ];
      let data = [];
      console.log('filterCategory', filterCategory);
      data.push({
        title: filterCategory.title,
        disabled: true,
      });
      data.push({
        id: filterCategory.id,
        title: '전체',
        key: filterCategory.key,
        hierarchy: filterCategory.hierarchy,
      });

      filterCategory.children.map(filter => {
        data.push(filter);
      });
      console.log('categoryFilterArray', data);
      this.filterCategoryTitle = this.treeDataForFilter[this.keyArray[1]].title;
      this.categoryTreeData = data;
    }
  };

  @action
  setCurrentCategory = currentCategory => {
    this.currentCategory = currentCategory;
  };

  @action
  setCategory = data => {
    this.category = data;
  };

  @action
  setKeyArray = data => {
    this.keyArray = data;
  };

  @computed get dataTree() {
    return toJS(this.categoryTreeData);
  }

  @computed get getExpandedKeys() {
    return this.expandedKeys.slice();
  }

  @computed get getKeyArray() {
    return this.keyArray;
  }

  @action
  setTitle = data => {
    this.title = data;
  };

  @computed get getCheckedKeys() {
    return this.checkedKeys.slice();
  }

  @observable categoryquery;

  @action
  onCheck = (checkedKeys, info) => {
    // console.log(info.node.props.eventKey.slice());
    // console.log("oncheck");
    // console.log(info.node.props);
    if (info.node.props.children.length > 0) {
      // 들어올 일 없음
    } else {
      let idx = -1;
      for (let i = 0; i < this.checkedKeys.length; i++) {
        if (toJS(this.checkedKeys[i]) == info.node.props.eventKey) idx = i;
      }

      if (idx === -1) {
        this.checkedKeys.push(info.node.props.eventKey);
        this.checkedKeysId.push(info.node.props.id);
      } else {
        this.checkedKeys.splice(idx, 1);
        this.checkedKeysId.splice(idx, 1);
      }

      let query = Router.router.query;

      this.categoryquery = this.checkedKeysId.join();

      this.toSearch(
        query.category,
        query.brand,
        query.page,
        query.unitPerPage,
        query.order,
        query.filter,
        this.categoryquery,
        query.enter,
        query.keyword
      );
    }
  };

  @action
  onSelect = (selectedKeys, info) => {
    // console.log("onselect");
    // console.log(info.node.props);

    let hierarchy = JSON.parse('[' + info.node.props.hierarchy + ']');
    if (selectedKeys.length == 0) selectedKeys = [info.node.props.eventKey];

    if (hierarchy.length === 2 || hierarchy.length === 3) {
      let query = Router.router.query;

      if (query.enter === 'brand') {
        this.toSearch(
          info.node.props.id,
          '',
          query.page,
          query.unitPerPage,
          query.order,
          '',
          '',
          query.enter,
          query.keyword
        );
      } else {
        this.toSearch(
          info.node.props.id,
          '',
          query.page,
          query.unitPerPage,
          query.order,
          '',
          '',
          query.enter,
          query.keyword
        );
      }

      this.categoryquery = '';

      this.setExpandedKeys(selectedKeys);
      this.checkedKeys = [];
      this.checkedKeysId = [];
    } else {
      if (this.checkedKeys.length > 0) {
        let idx = -1;
        for (let i = 0; i < this.checkedKeys.length; i++) {
          if (toJS(this.checkedKeys[i]) == selectedKeys[0]) idx = i;
        }

        if (idx === -1) {
          this.checkedKeys.push(selectedKeys[0]);
          this.checkedKeysId.push(info.node.props.id);
        } else {
          this.checkedKeys.splice(idx, 1);
          this.checkedKeysId.splice(idx, 1);
        }
        let query = Router.router.query;

        this.categoryquery = this.checkedKeysId.join();

        if (query.enter === 'brand') {
          this.toSearch(
            query.category,
            '',
            query.page,
            query.unitPerPage,
            query.order,
            '',
            this.categoryquery,
            query.enter,
            query.keyword
          );
        } else {
          this.toSearch(
            query.category,
            '',
            query.page,
            query.unitPerPage,
            query.order,
            '',
            this.categoryquery,
            query.enter,
            query.keyword
          );
        }
      } else {
        // check 처음 진입했을 떄

        this.checkedKeys.push(selectedKeys[0]);
        this.checkedKeysId.push(info.node.props.id);

        let query = Router.router.query;

        this.categoryquery = this.checkedKeysId.join();
        if (query.enter === 'brand') {
          this.toSearch(
            query.category,
            query.brand,
            query.page,
            query.unitPerPage,
            query.order,
            '',
            this.categoryquery,
            query.enter,
            query.keyword
          );
        } else {
          this.toSearch(
            query.category,
            '',
            query.page,
            query.unitPerPage,
            query.order,
            '',
            this.categoryquery,
            query.enter,
            query.keyword
          );
        }
      }
    }
  };

  @action
  setExpandedKeys = expandedKeys => {
    // console.log('expandedKeys : ', expandedKeys);
    if (expandedKeys == null) expandedKeys = '';

    if (Array.isArray(expandedKeys)) {
      this.expandedKeys = expandedKeys;
    } else {
      this.expandedKeys = [expandedKeys];
    }
  };

  // filter 부분
  // viewType : "TEXT_BUTTON", "RGB_BUTTON", "TEXT"\
  @observable filterData = [];

  @action
  setFilter = (filter, value) => {
    this.filterData.map((data, dataKey) => {
      if (data.id === filter.id) {
        data.attributes.map((attributes, attributesKey) => {
          if (attributes.id === value.id) {
            if (
              this.filterData[dataKey].attributes[attributesKey].filter !=
              undefined
            ) {
              this.filterData[dataKey].attributes[attributesKey].filter = !this
                .filterData[dataKey].attributes[attributesKey].filter;
            } else {
              extendObservable(
                this.filterData[dataKey].attributes[attributesKey],
                { filter: true }
              );
            }
          }
        });
      }
    });
    // console.log(toJS(this.filterData));
    let query = Router.router.query;
    // console.log("categoryquery", this.categoryquery);
    // if (this.categoryquery) console.log("true");
    // else console.log("false");

    let filterList = [];

    if (Array.isArray(toJS(this.filterData))) {
      this.filterData.map(filter => {
        filter.attributes.map(attr => {
          if (attr.filter) filterList.push(attr.id);
        });
      });
    }

    filterList = filterList
      .map(e => {
        return e;
      })
      .join(',');

    this.toSearch(
      query.category,
      query.brand,
      query.page,
      query.unitPerPage,
      query.order,
      filterList,
      query.subcategory,
      query.enter,
      query.keyword
    );
    window.scrollTo(0, 0);
  };

  @action
  toSearch = (
    category,
    brand,
    page,
    unitPerPage,
    order,
    filter,
    subcategory,
    enter,
    keyword
  ) => {
    Router.push({
      pathname: '/search',
      query: {
        category: category,
        brand: brand,
        page: page,
        unitPerPage: unitPerPage,
        order: order === null || order === '' ? 'DATE' : order,
        filter: filter,
        subcategory: subcategory,
        enter: enter,
        keyword: keyword,
      },
    });
  };
}

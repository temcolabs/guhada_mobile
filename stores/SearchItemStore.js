import { observable, action, computed, toJS, extendObservable } from 'mobx';
import {
  getCategoryTitle,
  getCategoryKeyArray,
  getCategory,
  getCategoryKey,
  getBrandTitle,
} from '../utils.js';
import Router from 'next/router';
import API from 'lib/API.js';
import { pushRoute } from 'lib/router/index.js';
import qs from 'qs';
const isServer = typeof window === 'undefined';

export default class SearchItemStore {
  @observable treeData = [];
  @observable item = [];
  @observable itemStatus = false;

  @observable hover = [false, false, false];
  @observable deals = [];

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
  }

  @observable scrollPosition;
  @observable dealsPage = 0;

  @observable infinityStauts = true;
  @observable endPage;

  @action
  listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScroll / height;

    this.scrollPosition = scrolled;
    let query = Router.router.query;

    if (
      this.scrollPosition > 0.7 &&
      this.infinityStauts === true &&
      this.dealsPage !== this.endPage
    ) {
      this.infinityStauts = false;
      this.dealsPage += 1;

      let brand = JSON.parse('[' + query.brand + ']');

      this.getSearchByUri(
        brand,
        query.category,
        this.dealsPage,
        query.unitPerPage,
        query.order,
        query.filter,
        query.subcategory,
        query.enter,
        query.keyword
      );
    }
  };

  @action
  initDealspage = () => {
    this.dealsPage = 1;
  };

  @action
  setItem = item => {
    let newDeals = this.deals;

    this.deals = newDeals.concat(item.deals);
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
      if (data.resultCode === 200) {
        this.setItem(data.data);

        this.itemStatus = true;
      }
    });
  };

  @action
  getsearchitem = query => {
    API.search.get('/ps/search?searchQuery=' + query).then(res => {
      let data = res.data;
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
        default:
          titleEnglish = 'Women';
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
    unitPerPage = 20,
    order,
    filterData,
    subcategory,
    enter,
    keyword,
    condition
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

    // order set
    this.setSearchOrderFilter(order);

    // 일반적인 카테고리 검색을 위해서 전체 카테고리 값을 불러오기 위한 api 콜
    API.search.get('/ps/search/all').then(async res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.locationFilter = data.data.categories;

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
              searchCondition: condition === '' ? null : condition,
            }
          )
          .then(res => {
            let data = res.data;
            if (data.resultCode === 200) {
              this.setItem(data.data);
              /**
               * mobile 작업
               */
              this.infinityStauts = true;
              this.scrollPosition = 0;

              if (enter !== 'keyword') {
                if (categoryIds) this.setHeaderCategory(categoryIds);
              }
              this.endPage = Math.floor(data.data.countOfDeals / 20) + 1;

              /**
               * 카테고리 기준 title 값
               */
              if (subcategory.length !== 0)
                this.setTitle(
                  getCategoryTitle(data.data.categories, subcategory)
                );
              else if (categoryIds)
                this.setTitle(
                  getCategoryTitle(data.data.categories, categoryIds)
                );

              ////////////////////////////////////

              if (enter === 'all') {
                // this.toGetBrandFilter(categoryList);
                // this.root.brands.brandsByCategoryFilter = data.data.brands;
                // this.root.brands.setGroupBrandList(data.data.brands);
                let keyArray;

                this.treeDataForFilter.map(treeData => {
                  if (treeData.id === hierarchy[0]) {
                    keyArray = treeData.key.split('-');
                  }
                });

                this.setKeyArray(keyArray);
                // this.setCategoryTreeData();
              } else if (enter === 'brand' || enter === 'keyword') {
                // 브랜드에서 category 목록이 없을 경우
                if (categoryList[0] === '') {
                  // this.toGetBrandFilter([]);
                  // this.root.brands.brandsByCategoryFilter = data.data.brands;
                  // this.root.brands.setGroupBrandList(data.data.brands);
                  this.treeDataForFilter = data.data.categories;
                  // this.setCategoryTreeData('brand');
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
                  this.treeDataForFilter = data.data.categories;
                  // this.setCategoryTreeData('brand');
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
                  // this.root.brands.setGroupBrandList(data.data.brands);
                  this.setKeyArray(
                    getCategoryKeyArray(this.treeDataForFilter, hierarchy[1])
                  );
                  // this.setCategoryTreeData('brand');

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
                // this.root.brands.setGroupBrandList(data.data.brands);
                // hierarchy === false 서버로부터 온 카테고리 데이타가 없음
                if (hierarchy) {
                  if (hierarchy.length === 1) {
                    this.setKeyArray(
                      getCategoryKeyArray(this.treeDataForFilter, hierarchy[0])
                    );
                  } else {
                    this.setKeyArray(
                      getCategoryKeyArray(this.treeDataForFilter, hierarchy[1])
                    );
                  }
                }
                // this.setCategoryTreeData();
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

              // this.pageNavigator(data.data.countOfDeals, unitPerPage);

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

  // @action
  // pageNavigator = (itemCountOfDeals, unitPerPage) => {
  //   this.itemCountOfDeals = itemCountOfDeals;
  //   this.unitPerPage = unitPerPage;
  //   let listCount = parseInt(this.itemCountOfDeals / this.unitPerPage) + 1;
  //   this.pageList = [];

  //   for (let i = 0; i < listCount; i++) {
  //     this.pageList.push(i + 1);
  //   }
  // };

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

  @observable headerCategory;
  @action
  setHeaderCategory = key => {
    let filterCategory = this.treeDataForFilter;
    let category = toJS(getCategory(filterCategory, key)).children;
    let hierarchies = category[0].hierarchies;
    let duplicated = false;

    function checkDuplicated(element, index, array) {
      let count = 0;
      for (let x = 0; x < array.length; x++) {
        if (array[x] === element) count++;
      }

      if (count > 1) duplicated = true;
    }

    hierarchies.find(checkDuplicated);

    // 가방이나 슈즈 같은 중복으로 들어가 있는 부분 판별을 위해서 검사
    if (duplicated === true) {
      let hierarchies = category[0].children[0].hierarchies;
      let parentIndex = hierarchies[hierarchies.length - 2];

      category[0].children.splice(0, 0, { title: '전체', id: parentIndex });

      this.headerCategory = category[0].children;
    } else {
      let hierarchies = category[0].hierarchies;
      let parentIndex = hierarchies[hierarchies.length - 2];

      category.splice(0, 0, { title: '전체', id: parentIndex });
      this.headerCategory = category;
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
    let query = Router.router.query;

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

  @observable preUrl;
  @action
  toSearch = ({
    category = '',
    brand = '',
    page = 1,
    unitPerPage = 20,
    order = 'DATE',
    filter = '',
    subcategory = '',
    enter = '',
    keyword = '',
    condition = '',
  }) => {
    pushRoute(
      `/search?${qs.stringify({
        category: category,
        brand: brand,
        page: page,
        unitPerPage: unitPerPage,
        order: order === null || order === '' ? 'DATE' : order,
        filter: filter,
        subcategory: subcategory,
        enter: enter,
        keyword: keyword,
        condition: condition === '' ? [] : condition,
      })}`
    );
    if (this.preUrl !== Router.asPath) this.deals = [];
  };

  @observable thumbnail = 'list4';
  @action
  setThumbnailStyle = style => {
    this.thumbnail = style;
  };
}

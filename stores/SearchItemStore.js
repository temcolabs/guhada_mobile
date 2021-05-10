import { observable, action, computed, toJS, extendObservable } from 'mobx';
import {
  getCategoryTitle,
  getCategoryKeyArray,
  getCategory,
  getCategoryKey,
  getBrandTitle,
} from '../utils.js';
import Router from 'next/router';
import API from 'childs/lib/API';
import { pushRoute } from 'childs/lib/router/index.js';
import qs from 'qs';
import _ from 'lodash';
import criteoTracker from 'childs/lib/tracking/criteo/criteoTracker';
import { devLog } from 'childs/lib/common/devLog.js';
import isTruthy from 'childs/lib/common/isTruthy.js';
import addCommaToArray from 'childs/lib/string/addCommaToArray.js';
import { conditionOption } from 'childs/lib/constant/filter/condition.js';
import KeywordMenu from 'components/header/keyword/KeywordMenu.js';
import SearchEnum from 'childs/lib/constant/filter/SearchEnum.js';

const isServer = typeof window === 'undefined';

export default class SearchItemStore {
  constructor(root) {
    if (!isServer) {
      this.root = root;
    }
  }

  @observable treeData = [];
  @observable item = [];
  @observable itemStatus = false;
  @observable itemEmpty = false;
  @observable hover = [false, false, false];
  @observable deals = [];

  @action
  toggleHover = (i) => {
    let hoversState = this.hover;
    hoversState[i] = true;

    this.hover = hoversState;
  };

  @action
  leaveHover = () => {
    this.hover = [false, false, false];
  };

  @observable scrollPosition;
  @observable dealsPage = 0;

  @observable infinityStauts = true;
  @observable endPage;
  @observable scrollDirection;
  @action
  listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const scrolled = winScroll / height;
    // 스트롤의 방향을 확인
    if (this.scrollPosition > scrolled) {
      this.scrollDirection = 'up';
    } else {
      this.scrollDirection = 'down';
    }

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
        query.keyword,
        query.resultKeyword,
        query.condition,
        query.productCondition,
        query.shippingCondition,
        query.minPrice,
        query.maxPrice
      );
    }
  };

  @action
  addPage = () => {
    let query = Router.router.query;
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
      query.keyword,
      query.resultKeyword,
      query.condition,
      query.productCondition,
      query.shippingCondition,
      query.minPrice,
      query.maxPrice,
      this.root.seller.sellerId,
      this.root.special.eventId
    );
  };
  @action
  initDealspage = () => {
    this.dealsPage = 1;
  };

  @action
  setItem = (item) => {
    let newDeals = this.deals;

    this.deals = newDeals.concat(item.deals);
    this.item = item;
  };

  @observable treeDataForFilter;
  @observable catidx;

  @action
  getTreeDataForFilter = () => {
    API.search.get('/ps/search/all').then((res) => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.treeDataForFilter = data.data.categories;
      }
    });
  };

  @action
  getItem = () => {
    API.product.get('/deals').then((res) => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.setItem(data.data);

        this.itemStatus = true;
      }
    });
  };

  @action
  getsearchitem = (query) => {
    API.search.get('/ps/search?searchQuery=' + query).then((res) => {
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
    API.search.get('/ps/search/brand/' + brandId).then((res) => {
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
  setSearchOrderFilter = (order) => {
    this.searchOrderFilter = order;
  };

  @observable locationFilter;
  @observable locationHierarchy = [];
  @observable locationGuide = [];
  @observable locationKey = [];
  @action
  LocationGuide = (value) => {
    this.locationKey = [];
    let key = toJS(this.locationHierarchy.key);
    this.locationKey = key.split('-').map(Number);
    this.locationGuide = [];
    let firstLocationFilter = [];

    this.locationFilter.map((locationFilter) => {
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
  saveSearchKeyword = (keyword = '') => {
    devLog('[SearchItemStore] - saveSearchKeyword called.');

    API.settle
      .get('/search/word', {
        params: {
          agent: 'MWEB',
          word: keyword,
        },
      })
      .then((res) => {
        // do nothing
      });
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
    resultKeyword = '',
    condition,
    productCondition = 'ANY',
    shippingCondition = 'ANY',
    minPrice = 0,
    maxPrice = 0,
    sellerIds = '',
    eventIds = ''
  ) => {
    devLog('[SearchItemStore] - getSearchByUri called.');
    this.itemEmpty = false;

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

    // 유저 키워드 서치 stat으로 저장
    if (keyword.length > 1) {
      this.saveSearchKeyword(keyword);
    }

    // order set
    this.setSearchOrderFilter(order);

    // 일반적인 카테고리 검색을 위해서 전체 카테고리 값을 불러오기 위한 api 콜
    API.search.get('/ps/search/all').then(async (res) => {
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
            brandIds.map((brand) => {
              if (brand.id) brandList.push(brand.id);
              else brandList.push(brand);
            });
          }
        }

        let categoryList = [];

        if (subcategory[0] != null) {
          categoryList = [];
          categoryList = JSON.parse('[' + subcategory + ']');

          // this.checkedKeys = [];
          // this.checkedKeysId = [];

          // categoryList.map(category => {
          //   this.checkedKeys.push(
          //     getCategoryKey(this.treeDataForFilter, category)
          //   );
          //   this.checkedKeysId.push(category);
          // });
        } else {
          categoryList.push(categoryIds);
        }

        let filterList = [];

        if (!filterData) {
          filterData = '';
        }

        let filterCount = JSON.parse('[' + filterData + ']');

        if (Array.isArray(toJS(filterCount))) {
          filterCount.map((filter) => {
            filterList.push({ filterAttributeId: filter });
          });
        }

        // category uri 값을 통해서 tree의 기본 key 값을 찾아
        // 열어주3는 기능

        let hierarchy;
        if (categoryIds) {
          let getTreeData = getCategory(this.treeDataForFilter, categoryIds);
        }

        let query = Router.router.query;
        this.productCondition = productCondition;
        this.shippingCondition = shippingCondition;

        let searchResultKeyword = [];
        if (isTruthy(keyword)) searchResultKeyword.push(keyword);
        if (isTruthy(resultKeyword)) searchResultKeyword.push(resultKeyword);

        API.search
          .post(
            '/ps/search/filter?page=' + page + '&unitPerPage=' + unitPerPage,
            {
              brandIds: brandList,
              categoryIds: categoryList,
              filters: filterList,
              searchQueries: searchResultKeyword,
              searchResultOrder:
                order === null || order === '' ? 'DATE' : order,
              searchCondition: condition === '' ? null : condition,
              productCondition: productCondition,
              shippingCondition: shippingCondition,
              minPrice: minPrice,
              maxPrice: maxPrice,
              sellerIds: sellerIds === '' ? null : [sellerIds],
              eventIds: eventIds === '' ? null : [eventIds],
            }
          )
          .then((res) => {
            let data = res.data;

            // 카테고리의 checkedKey 값을 검색하기 위한 기능
            this.checkedKeys = [];
            this.checkedKeysId = [];

            categoryList.map((category) => {
              this.checkedKeys.push(
                getCategoryKey(data.data.categories, category)
              );
              this.checkedKeysId.push(category);
            });

            devLog('[SearchItemStore] - checked keys :  ' + this.checkedKeys);

            if (data.resultCode === 200) {
              // * 목록 검색 성공 후 크리테오 트래커 실행
              const { deals } = data.data;
              this.countOfDeals = data.data.countOfDeals;
              if (deals.length >= 3) {
                criteoTracker.searchResults({
                  email: this.root.user.userInfo?.email,
                  dealIds: deals?.slice(0, 3).map((deal) => deal.dealId),
                });
              }

              this.setItem(data.data);
              /**
               * mobile 작업
               */
              this.infinityStauts = true;
              this.scrollPosition = 0;

              if (enter !== 'keyword' && enter !== 'brand') {
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

              // SearchCategory init key 값 설정
              if (
                categoryIds &&
                data &&
                data.data &&
                data.data.categories &&
                data.data.categories.length !== 0
              )
                this.setExpandedKeys(
                  getCategory(data.data.categories, categoryIds).key
                );

              if (enter === 'all') {
                let keyArray;

                this.treeDataForFilter.map((treeData) => {
                  if (treeData.id === hierarchy[0]) {
                    keyArray = treeData.key.split('-');
                  }
                });

                this.setKeyArray(keyArray);
                // this.setCategoryTreeData();
              } else if (enter === 'brand' || enter === 'keyword') {
                // 브랜드에서 category 목록이 없을 경우
                if (categoryList[0] === '') {
                  this.treeDataForFilter = data.data.categories;
                  if (enter === 'keyword') {
                    this.setTitle(keyword);
                  } else {
                    let brand = JSON.parse('[' + query.brand + ']');

                    if (
                      _.isNil(query.condition) === false &&
                      query.condition !== ''
                    ) {
                      const condition = [
                        { label: 'PREMIUM ITEM', value: 'PLUS' },
                        { label: 'BEST ITEM', value: 'BEST' },
                        { label: 'NEW IN', value: 'NEW' },
                      ];

                      condition.map((c) => {
                        if (c.value === query.condition) {
                          return this.setTitle(c.label);
                        }
                      });
                    } else if (brand.length >= 2) {
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
                  if (enter === 'keyword') {
                    this.setTitle(keyword);
                  } else {
                    let brand = JSON.parse('[' + query.brand + ']');

                    if (
                      _.isNil(query.condition) === false &&
                      query.condition !== ''
                    ) {
                      const condition = [
                        { label: 'PREMIUM ITEM', value: 'PLUS' },
                        { label: 'BEST ITEM', value: 'BEST' },
                        { label: 'NEW IN', value: 'NEW' },
                      ];

                      condition.map((c) => {
                        if (c.value === query.condition) {
                          return this.setTitle(c.label);
                        }
                      });
                    } else if (brand.length >= 2) {
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
                  if (enter === 'keyword') {
                    this.setTitle(keyword);
                  } else {
                    let brand = JSON.parse('[' + query.brand + ']');

                    if (
                      _.isNil(query.condition) === false &&
                      query.condition !== ''
                    ) {
                      const condition = [
                        { label: 'PREMIUM ITEM', value: 'PLUS' },
                        { label: 'BEST ITEM', value: 'BEST' },
                        { label: 'NEW IN', value: 'NEW' },
                      ];

                      condition.map((c) => {
                        if (c.value === query.condition) {
                          return this.setTitle(c.label);
                        }
                      });
                    } else if (brand.length >= 2) {
                      this.setTitle('검색 결과');
                    } else if (brand.length === 0) {
                      this.setTitle('전체 상품');
                    } else {
                      this.setTitle(
                        getBrandTitle(toJS(data.data.brands), query.brand)
                      );
                    }
                  }
                }
              } else {
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
              }

              this.filterData = data.data.filters;
              filterList.map((value) => {
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

              if (_.size(this.deals) === 0) {
                this.itemEmpty = true;
              } else {
                this.itemEmpty = false;
              }

              this.itemStatus = true;
            }
          });
      }
    });
  };

  @action
  toGetBrandFilter = (categoryList) => {
    API.search
      .post('/ps/search/filter', {
        categoryIds: categoryList,
      })
      .then((res) => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.root.brands.brandsByCategoryFilter = data.data.brands;
        }
      });
  };

  @observable itemCountOfDeals;
  @observable unitPerPage = 20;
  @observable pageList = [];

  @observable countOfDeals;

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
  setHeaderCategory = (key) => {
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

      category[0].children.splice(0, 0, { title: '전체보기', id: parentIndex });

      this.headerCategory = category[0].children;
    } else {
      let hierarchies = category[0].hierarchies;
      let parentIndex = hierarchies[hierarchies.length - 2];

      category.splice(0, 0, { title: '전체보기', id: parentIndex });
      this.headerCategory = category;
    }
  };

  @action
  setCurrentCategory = (currentCategory) => {
    this.currentCategory = currentCategory;
  };

  @action
  setCategory = (data) => {
    this.category = data;
  };

  @action
  setKeyArray = (data) => {
    this.keyArray = data;
  };

  @computed get dataTree() {
    return toJS(this.categoryTreeData);
  }

  @computed get getExpandedKeys() {
    devLog('getExpandedKeys called. this.expandedKeys : ' + this.expandedKeys);
    return this.expandedKeys.slice().filter((x) => x);
  }
  @action
  setExpandedKeys = (expandedKeys) => {
    devLog('setExpandedKeys called. setExpandedKeys : ' + expandedKeys);
    if (expandedKeys == null) expandedKeys = '';

    if (Array.isArray(expandedKeys)) {
      this.expandedKeys = expandedKeys;
    } else {
      this.expandedKeys = [expandedKeys];
    }
  };

  @computed get getKeyArray() {
    return this.keyArray;
  }

  @action
  setTitle = (data) => {
    this.title = data;
  };

  @observable categoryquery;

  @computed get getCheckedKeys() {
    devLog(
      '[SearchItemStore] - getCheckedKeys called. this.checkedKeys : ' +
        this.checkedKeys
    );
    return this.checkedKeys.slice();
  }

  @action
  initCheckedKeys = () => {
    this.checkedKeys = [];
    this.checkedKeysId = [];
  };

  checkDuplicatedCheckedKeys(info) {
    let idx = -1;
    for (let i = 0; i < this.checkedKeys.length; i++) {
      if (toJS(this.checkedKeys[i]) === info.node.props.eventKey) idx = i;
    }

    if (idx === -1) {
      this.checkedKeys.push(info.node.props.eventKey);
      this.checkedKeysId.push(info.node.props.id);
    } else {
      this.checkedKeys.splice(idx, 1);
      this.checkedKeysId.splice(idx, 1);
    }
    devLog('[SearchItemStore] - checked keys :  ' + this.checkedKeys);
  }

  @action
  onCheck = (checkedKeys, info) => {
    devLog('[SearchItemStore] - onCheck called. ' + this.checkedKeys);
    let classNames = info.node.props.className;
    if (classNames === 'ableCheckbox') {
      this.checkDuplicatedCheckedKeys(info);
    } else {
      this.setExpandedKeys(checkedKeys);
    }
  };
  @observable selectCategory;

  /**
   * 상세 검색 > 카테고리 > 드롭다운 선택 초기화
   *  1-1) hierarchies ID를 통해 부모 노드 반환
   *  1-2) 부모가 Root인 경우, 초기값 반환
   */
  checkDuplicatedSelectedKeys() {
    let tempCategory = this.item?.categories;
    const category = this.selectCategory.hierarchies
      .slice(0, this.selectCategory.hierarchies.length - 1)
      .reduce((acc, v, i) => {
        acc = tempCategory.find((ele) => ele.id === v);
        tempCategory = acc?.children;
        return acc;
      }, {});

    return {
      category: Object.keys(category).length ? category : {},
      keys: Object.keys(category).length ? category.key : [],
    };
  }

  @action
  onSelect = (selectedKeys, info) => {
    devLog('[SearchItemStore] - onSelect called.');
    let category = info.node.props;
    let classNames = info.node.props.className;

    // 체크박스 중복체크
    if (classNames === 'ableCheckbox') {
      this.checkDuplicatedCheckedKeys(info);
    } else {
      // 드롭다운 중복체크
      if (this.selectCategory?.id === info.node.props?.id) {
        if (this.selectCategory?.hierarchies.length) {
          const selected = this.checkDuplicatedSelectedKeys();

          category = selected.category;
          selectedKeys = selected.keys;
        }
      }
      // 선택 초기화
      this.setExpandedKeys(selectedKeys);
      this.selectCategory = selectedKeys.length ? category : {};
      this.initCheckedKeys();
    }
  };

  @action
  initFilter = () => {
    devLog('[searchItemStore] initFilter called.');
    this.filterBrand = [];
    this.filterData.map((data, dataKey) => {
      return data.attributes.map((attributes, attributesKey) => {
        if (
          !_.isNil(this.filterData[dataKey].attributes[attributesKey].filter)
        ) {
          this.filterData[dataKey].attributes[attributesKey].filter = false;
        }
      });
    });

    let query = Router.router.query;
    this.productCondition = query.productCondition;
    this.shippingCondition = query.shippingCondition;
    this.minPrice = query.minPrice;
    this.maxPrice = query.maxPrice;
    this.resultKeyword = '';
    query.category = '';
    query.brand = '';
    query.conditionValue = '';
  };

  @action
  clearFilter = () => {
    devLog('[searchItemStore] clearFilter called.');
    this.initFilter();
    this.toSearch({ resultKeyword: '' });
  };

  @action
  searchFilter = () => {
    let brandList = [];
    let filterList = [];
    let category;
    let subCategoryList = [];

    let brandListTitle = [];
    let filterListTitle = [];
    let categoryListTitle = [];
    let subCategoryListTitle = [];

    let query = Router.router.query;

    if (Number(this.minPrice) > Number(this.maxPrice)) {
      this.root.alert.showAlert('최대 가격은 최소 가격보다 커야 합니다.');
      return false;
    }

    // filter list push
    if (Array.isArray(toJS(this.filterData))) {
      this.filterData.map((filter) => {
        filter.attributes.map((attr) => {
          if (attr.filter) {
            filterList.push(attr.id);
            filterListTitle.push(attr);
          }
        });
      });
    }

    if (query.enter === 'brand') {
      brandList.push(query.brand.split(',')[0]);
    }

    // brand list push
    if (Array.isArray(toJS(this.filterBrand))) {
      this.filterBrand.map((brand) => {
        brandList.push(brand.id);
        brandListTitle.push(brand);
      });
    }

    // subcategory list push
    if (Array.isArray(toJS(this.checkedKeysId))) {
      this.checkedKeysId.map((subcategory) => {
        subCategoryListTitle.push({
          title: getCategoryTitle(this.locationFilter, subcategory),
          id: subcategory,
        });
      });
    }

    this.searchFilterList['brand'] = brandListTitle;
    this.searchFilterList['filter'] = filterListTitle;

    categoryListTitle.push({
      title: isTruthy(this.selectCategory)
        ? getCategoryTitle(this.locationFilter, toJS(this.selectCategory.id))
        : getCategoryTitle(this.locationFilter, query.category),
      id: isTruthy(this.selectCategory)
        ? toJS(this.selectCategory.id)
        : query.category,
    });
    this.searchFilterList['category'] = categoryListTitle;
    this.searchFilterList['subcategory'] = subCategoryListTitle;

    brandList = addCommaToArray(brandList);
    filterList = addCommaToArray(filterList);
    subCategoryList = addCommaToArray(this.checkedKeysId);
    category = isTruthy(this.selectCategory)
      ? toJS(this.selectCategory.id)
      : query.category;

    if (query.enter === 'keyword') {
      this.toSearch({
        category: category,
        brand: brandList,
        filter: filterList,
        subcategory: subCategoryList,
        keyword: query.keyword,
        resultKeyword: this.resultKeyword,
        filtered: true,
        productCondition: this.productCondition,
        shippingCondition: this.shippingCondition,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        sellerIds: this.root.seller.sellerId || '',
        eventIds: this.root.special.eventId || '',
      });
    } else {
      this.toSearch({
        category: category,
        brand: brandList,
        filter: filterList,
        subcategory: subCategoryList,
        keyword: query.keyword,
        resultKeyword: this.resultKeyword,
        filtered: true,
        productCondition: this.productCondition,
        shippingCondition: this.shippingCondition,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        sellerIds: this.root.seller.sellerId || '',
        eventIds: this.root.special.eventId || '',
      });
    }
  };

  @action
  initSearchFilterList = () => {
    this.checkedKeysId = [];
    this.searchFilterList = {
      brand: [],
      filter: [],
      category: [],
      subcategory: [],
    };
  };

  @observable searchFilterList = {
    brand: [],
    filter: [],
    category: [],
    subcategory: [],
  };

  @observable filterBrand = [];
  setFilterBrand = (brand) => {
    const idx = this.filterBrand.findIndex(function(item) {
      return item.id === brand.id;
    });

    if (idx > -1) {
      this.filterBrand.splice(idx, 1);
    } else {
      this.filterBrand = [...this.filterBrand, brand];
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
    let filterList = [];

    if (Array.isArray(toJS(this.filterData))) {
      this.filterData.map((filter) => {
        filter.attributes.map((attr) => {
          if (attr.filter) filterList.push(attr.id);
        });
      });
    }

    filterList = filterList
      .map((e) => {
        return e;
      })
      .join(',');
  };

  @observable productCondition = 'ANY';
  @observable shippingCondition = 'ANY';

  @action
  setCondition = (condition, option) => {
    if (option === conditionOption.internationalShipping) {
      if (this.shippingCondition === condition) {
        this.shippingCondition = 'ANY';
      } else {
        this.shippingCondition = condition;
      }
    } else if (option === conditionOption.brandNew) {
      if (this.productCondition === condition) {
        this.productCondition = 'ANY';
      } else {
        this.productCondition = condition;
      }
    }
  };

  @observable minPrice = '';
  @observable maxPrice = '';

  @action
  setPriceFilter = ({ min, max }) => {
    this.minPrice = min;
    this.maxPrice = max;
  };

  @observable resultKeyword = '';
  setResultSearchFilter = (value) => {
    this.resultKeyword = value;
  };

  @observable preUrl;

  @action
  toSearch = ({
    category = '',
    brand = '',
    page = 1,
    unitPerPage = 20,
    order = this.searchOrderFilter,
    filter = '',
    subcategory = '',
    enter = '',
    keyword = '',
    resultKeyword = '',
    condition = '',
    filtered = false,
    productCondition = 'ANY',
    shippingCondition = 'ANY',
    minPrice = '',
    maxPrice = '',
    sellerIds = this.root.seller.sellerId || '',
    eventIds = this.root.special.eventId || '',
    searchSourceFrom = '',
  }) => {
    devLog(
      '[toSearch function] Search button clicked. searchSourceFrom : ' +
        searchSourceFrom
    );
    if (searchSourceFrom === SearchEnum.GLOBAL_SEARCH_INPUT) this.initFilter();
    let query = Router.router.query;
    this.productCondition = productCondition;
    this.shippingCondition = shippingCondition;

    let categoryValue =
      category === '' && !(_.isEmpty(query) || query === undefined)
        ? query.category
        : category;
    let brandValue =
      brand === '' && !(_.isEmpty(query) || query === undefined)
        ? query.brand
        : brand;
    let keywordValue =
      keyword === '' && !(_.isEmpty(query) || query === undefined)
        ? query.keyword
        : keyword;
    let conditionValue =
      condition === '' && !(_.isEmpty(query) || query === undefined)
        ? query.condition
        : condition;
    let enterValue =
      enter === '' && !(_.isEmpty(query) || query === undefined)
        ? query.enter
        : enter;

    let queryStringify = qs.stringify({
      category: categoryValue,
      brand: brandValue,
      page: page,
      unitPerPage:
        searchSourceFrom ===
        (SearchEnum.SELLER_STORE || SearchEnum.PROMOTION_PAGE)
          ? SearchEnum.DEFAULT_SELLER_STORE_UNIT_PER_PAGE
          : SearchEnum.DEFAULT_GLOBAL_SEARCH_UNIT_PER_PAGE,
      order:
        order === null || order === ''
          ? SearchEnum.DEFAULT_SEARCH_ORDER
          : order,
      filter: filter,
      subcategory: subcategory,
      enter: enterValue,
      keyword: keywordValue,
      resultKeyword: resultKeyword,
      condition: conditionValue,
      filtered: filtered,
      productCondition: this.productCondition,
      shippingCondition: this.shippingCondition,
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
    devLog('query string : ' + queryStringify.toString());
    if (searchSourceFrom === SearchEnum.GLOBAL_SEARCH_INPUT) {
      pushRoute(`/search?${queryStringify}`);
    } else if (searchSourceFrom === SearchEnum.SELLER_STORE || sellerIds) {
      pushRoute(`/store/${this.root.seller.nickname}?${queryStringify}`);
    } else if (eventIds) {
      pushRoute(
        `/event/special/${this.root.special.eventId}?${queryStringify}`
      );
    } else {
      pushRoute(`/search?${queryStringify}`);
    }

    if (this.preUrl !== Router.asPath) this.deals = [];
  };

  @action
  toSearchStayPosition = ({
    category = '',
    brand = '',
    page = 1,
    unitPerPage = 20,
    order = this.searchOrderFilter,
    filter = '',
    subcategory = '',
    enter = '',
    keyword = '',
    resultKeyword = '',
    condition = '',
    filtered = false,
    productCondition = 'ANY',
    shippingCondition = 'ANY',
    minPrice = '',
    maxPrice = '',
    sellerIds = this.root.seller.sellerId || '',
    eventIds = this.root.special.eventId || '',
  }) => {
    devLog('[toSearchStayPosition function]Search button clicked.');
    let query = Router.router.query;
    this.productCondition = productCondition;
    this.shippingCondition = shippingCondition;

    if (sellerIds === '' && eventIds === '') {
      pushRoute(
        `/search?${qs.stringify({
          category: category,
          brand: brand,
          page: page,
          unitPerPage: unitPerPage,
          order: order === null || order === '' ? 'DATE' : order,
          filter: filter,
          subcategory: subcategory,
          enter: enter === '' ? query.enter : enter,
          keyword: keyword === 'empty' ? query.keyword : keyword,
          resultKeyword: resultKeyword,
          condition: condition === 'empty' ? query.condition : condition,
          filtered: filtered,
          productCondition: this.productCondition,
          shippingCondition: this.shippingCondition,
          minPrice: minPrice,
          maxPrice: maxPrice,
        })}`
      );
    } else if (sellerIds && eventIds === '') {
      pushRoute(
        `/store/${this.root.seller.nickname}?${qs.stringify({
          category: category,
          brand: brand,
          page: page,
          unitPerPage: unitPerPage,
          order: order === null || order === '' ? 'DATE' : order,
          filter: filter,
          subcategory: subcategory,
          enter: enter === '' ? query.enter : enter,
          keyword: keyword === 'empty' ? query.keyword : keyword,
          resultKeyword: resultKeyword,
          condition: condition === '' ? query.condition : condition,
          filtered: filtered,
          productCondition: this.productCondition,
          shippingCondition: this.shippingCondition,
          minPrice: minPrice,
          maxPrice: maxPrice,
        })}`
      );
    } else if (eventIds && sellerIds === '') {
      pushRoute(
        `/event/special/${this.root.special.eventId}?${qs.stringify({
          category: category,
          brand: brand,
          page: page,
          unitPerPage: unitPerPage,
          order: order === null || order === '' ? 'DATE' : order,
          filter: filter,
          subcategory: subcategory,
          enter: enter === '' ? query.enter : enter,
          keyword: keyword === 'empty' ? query.keyword : keyword,
          resultKeyword: resultKeyword,
          condition: condition === '' ? query.condition : condition,
          filtered: filtered,
          productCondition: this.productCondition,
          shippingCondition: this.shippingCondition,
          minPrice: minPrice,
          maxPrice: maxPrice,
        })}`
      );
    }
    if (this.preUrl !== Router.asPath) this.deals = [];
  };

  @observable thumbnail = 'list4';
  @action
  setThumbnailStyle = (style) => {
    this.thumbnail = style;
  };
}

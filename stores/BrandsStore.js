import Axios from 'axios';
import { observable, action, computed, toJS, runInAction } from 'mobx';
import { getBrandTitle } from '../utils';
import API from 'lib/API';
import findChoKorean from 'lib/findChoKorean';

const isServer = typeof window === 'undefined';

export default class BrandsStore {
  @observable brands = [];
  @observable selectedBrands = [];
  @observable selectedFilter = 'ALL';
  @observable selectedTitle = '';
  @observable brandId = '';
  @observable filterId = 'ALL';

  @observable productAddSelectedBrand;
  @observable brandsByCategory = [];
  @observable brandsByCategoryFilter = [];
  @observable originBrandsByCategory = [];
  @observable countOfDeals = '';

  @observable selectedBrandsKey = [];
  @observable filterLanguage = 'en';
  /**
   *
   * mobile 추가 param
   */
  @observable selectedLanguage = 'english';

  constructor(root) {
    if (!isServer) this.root = root;

    this.setFilterLabel();
    this.getBrands();
  }

  @action
  setSelectedLanguage = language => {
    this.selectedLanguage = language;
  };

  @action
  setBrands = (brands, selectedBrands) => {
    this.brands = brands;
    this.selectedBrands = selectedBrands;
  };

  @action
  setFilter = selectedFilter => {
    this.selectedFilter = selectedFilter;
  };

  @action
  setFilterId = id => {
    this.filterId = id;
  };

  @action
  setBrandId = id => {
    this.brandId = id;
  };

  @action
  setProductAddBrand = brand => {
    this.productAddSelectedBrand = brand;
  };

  @action
  getBrands = brand => {
    API.product.get(`/brands?viewType=GROUP`).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.setBrands(data.data, data.data['ALL']);
        this.setGroupBrandList(data.data['ALL']);
        if (brand) {
          this.getSelectedTitle(brand);

          this.setBrands(data.data, data.data[this.filterId]);
        }
      } else {
      }
    });
  };

  @action
  getFavoriteBrands = () => {
    API.product.get('/brands?filters=favorites').then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        console.log(data.data);
        this.setBrands(this.brands, data.data.brands);
      } else {
      }
    });
  };

  @action
  getPopularityBrands = () => {
    API.product.get('/brands?sort=popularity').then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        // console.log(data);
        this.setBrands(this.brands, data.data.brands);
      } else {
      }
    });
  };

  @action
  filterBrand = filter => {
    let selectedBrands = [];
    let checkFilter;
    if (filter === 'No.') {
      checkFilter = filter;
      filter = '#';
    } else if (filter === '숫자') {
      checkFilter = filter;
      filter = '#';
    } else if (filter === '전체') {
      checkFilter = filter;
      filter = 'ALL';
    }

    if (this.brands[filter]) {
      selectedBrands = this.brands[filter];

      if (checkFilter) this.setFilter(checkFilter);
      else this.setFilter(filter);

      this.setFilterId(filter);
    }

    this.setBrands(this.brands, selectedBrands);
  };

  /**
   * 모바일 브랜드 검색을 위한 function
   */
  @action
  searchBrand = search => {
    let selectedBrands = {};
    let searchText = search;
    var regKorean = /^[\가-\힣+]*$/;

    function is_hangul_char(ch) {
      let c = ch.charCodeAt(0);
      if (0x1100 <= c && c <= 0x11ff) return true;
      if (0x3130 <= c && c <= 0x318f) return true;
      if (0xac00 <= c && c <= 0xd7a3) return true;
      return false;
    }

    if (is_hangul_char(search)) {
      this.koFilter.forEach(element => {
        selectedBrands[element] = [];
      });

      this.setSelectedLanguage('korean');
      if (!regKorean.test(searchText)) {
        searchText = searchText.substring(0, searchText.length - 1);
      }

      this.koFilter.forEach(kobind => {
        this.originalKoList[kobind].forEach(element => {
          if (element['nameKo'].indexOf(searchText) !== -1) {
            selectedBrands[kobind].push(element);
          }
        });
      });

      this.koList = selectedBrands;
    } else {
      this.enFilter.forEach(element => {
        selectedBrands[element] = [];
      });

      this.setSelectedLanguage('english');
      this.enFilter.forEach(enbind => {
        this.originalEnList[enbind].forEach(element => {
          if (
            element['nameEn'].toLowerCase().indexOf(searchText.toLowerCase()) !=
            -1
          ) {
            selectedBrands[enbind].push(element);
          }
        });
      });

      this.enList = selectedBrands;
    }
  };

  @action getTitle = id => {
    return getBrandTitle(toJS(this.brands['ALL']), id);
  };

  @action getSelectedTitle = id => {
    this.selectedTitle = getBrandTitle(toJS(this.selectedBrands), id);
  };

  @action
  getBrandsByCategory = categoryId => {
    API.product
      .get('/brands?categoryId=' + categoryId + '&viewType=GROUP')
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          // this.brandsByCategory = data.data['ALL'];
          this.setBrandFilterList(data.data['ALL'], 'category');
          // this.originBrandsByCategory = data.data;
          // this.countOfDeals = data.data.countOfDeals;
        }
      });
  };

  @observable enFilter = [];
  @observable enList = [];
  @observable koFilter = [];
  @observable koList = [];

  /**
   * mobile 에서 추가로 정의 된 데이터
   */
  @observable originalEnList = [];
  @observable originalKoList = [];

  @action
  setFilterLabel = () => {
    const english = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    english.push('No.');

    this.enFilter = english;

    const korean = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ'.split('');
    korean.push('숫자');

    this.koFilter = korean;
  };

  @action
  setBrandFilterList = (brands, flags) => {
    let englishList = {};

    this.enFilter.map(english => {
      englishList[english] = [];
    });

    let koreanList = {};

    this.koFilter.map(korean => {
      koreanList[korean] = [];
    });

    if (flags === 'category') {
      englishList['ALL'] = [];
      koreanList['ALL'] = [];
    }

    brands.map(brand => {
      let pattern_eng = /[A-Z]/;
      let brandEng = brand.nameEn.substring(0, 1).toUpperCase();
      if (flags === 'category') {
        englishList['ALL'].push(brand);
      }

      if (!pattern_eng.test(brandEng)) {
        englishList['No.'].push(brand);
      } else {
        englishList[brandEng].push(brand);
      }
    });

    let koreanBrands = brands;
    // 브랜드 한글 정렬
    koreanBrands.sort(function(a, b) {
      var x = a.nameKo.toLowerCase();
      var y = b.nameKo.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    });

    koreanBrands.map(brand => {
      let pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
      let brandKor = brand.nameKo.substring(0, 1).toUpperCase();

      if (flags === 'category') {
        koreanList['ALL'].push(brand);
      }

      if (!pattern_kor.test(brandKor)) {
        koreanList['숫자'].push(brand);
      } else {
        koreanList[findChoKorean(brandKor)].push(brand);
      }
    });
    if (flags === 'search') {
      this.setEnList(englishList);
      this.setKoList(koreanList);
    } else if (flags === 'category') {
      this.setCategoryEnList(englishList);
      this.setCategoryKoList(koreanList);
    }
  };

  @action
  setEnList = list => {
    this.enList = list;
    this.originalEnList = list;
  };

  @action
  setKoList = list => {
    this.koList = list;
    this.originalKoList = list;
  };

  // 구조화 시킨 오리지널 리스트
  @observable categoryEnList = [];
  @observable categoryKoList = [];
  // 결과 값
  @observable filterBrandList = [];

  // HeaderBrand.js 사용하는 값
  @observable headerBrandLanguage = 'english';

  @action
  setHeaderBrandLanguage = language => {
    this.headerBrandLanguage = language;
  };

  @action
  setCategoryEnList = list => {
    this.categoryEnList = list;
    this.filterBrandList = list['ALL'];
  };

  @action
  setFilterEnList = flag => {
    this.filterBrandList = this.categoryEnList[flag];
  };

  @action
  setCategoryKoList = list => {
    this.categoryKoList = list;
  };

  @action
  setFilterKoList = flag => {
    this.filterBrandList = this.categoryKoList[flag];
  };

  @action
  setGroupBrandList = brands => {
    this.setBrandFilterList(brands, 'search');
  };

  @action
  searchBrandsByCategory = search => {
    let selectedBrands = [];
    let searchText = search;
    var regKorean = /^[\가-\힣+]*$/;

    function is_hangul_char(ch) {
      let c = ch.charCodeAt(0);
      if (0x1100 <= c && c <= 0x11ff) return true;
      if (0x3130 <= c && c <= 0x318f) return true;
      if (0xac00 <= c && c <= 0xd7a3) return true;
      return false;
    }

    if (is_hangul_char(search)) {
      this.setHeaderBrandLanguage('korean');

      if (!regKorean.test(searchText)) {
        searchText = searchText.substring(0, searchText.length - 1);
      }

      this.categoryKoList['ALL'].sort(function(a, b) {
        return a.nameKo < a.nameKo ? -1 : a.nameKo > b.nameKo ? 1 : 0;
      });

      this.categoryKoList['ALL'].forEach(element => {
        if (element['nameKo'].indexOf(searchText) != -1) {
          selectedBrands.push(element);
        }
      });
    } else {
      this.setHeaderBrandLanguage('english');
      this.categoryEnList['ALL'].forEach(element => {
        if (
          element['nameEn'].toLowerCase().indexOf(searchText.toLowerCase()) !=
          -1
        ) {
          selectedBrands.push(element);
        }
      });
    }

    this.filterBrandList = selectedBrands;
  };

  @action
  initBrandsByCategory = () => {
    this.brandsByCategory = [];
    this.selectedBrandsKey = [];
  };

  @action
  initSelectedBrandsKey = () => {
    this.selectedBrandsKey = [];
  };

  @action
  searchBrandKey = (name, id) => {
    let addCheck = true;
    let addIndex;
    this.selectedBrandsKey.map((data, i) => {
      if (data.id === id) {
        addCheck = false;
        addIndex = i;
      }
    });

    if (addCheck) this.selectedBrandsKey.push({ name: name, id: id });
    else this.selectedBrandsKey.splice(addIndex, 1);
  };

  @action
  searchBrandKeyTrue = id => {
    let iconBool = false;
    for (let x = 0; x < this.selectedBrandsKey.length; x++) {
      if (id === this.selectedBrandsKey[x].id) iconBool = true;
    }

    return iconBool;
  };

  @computed
  get getSelectedBrandsKey() {
    let brandkeylist = [];
    this.selectedBrandsKey.map(brandkey => {
      brandkeylist.push(brandkey.id);
    });

    brandkeylist = brandkeylist
      .map(e => {
        return e;
      })
      .join(',');

    console.log('brandkeylist', brandkeylist);
    return brandkeylist;
  }
  @action
  setFilterLanguage = language => {
    this.filterLanguage = language;

    let selectedBrands = [];

    if (language === 'ko') {
      this.brands['ALL'].forEach(element => {
        selectedBrands.push(element);
      });

      selectedBrands.sort(function(a, b) {
        var x = a.nameKo.toLowerCase();
        var y = b.nameKo.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    } else {
      this.brands['ALL'].forEach(element => {
        selectedBrands.push(element);
      });

      selectedBrands.sort(function(a, b) {
        var x = a.nameEn.toLowerCase();
        var y = b.nameEn.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }

    this.setFilter('ALL');
    this.setBrands(this.brands, selectedBrands);
  };
}

import { observable, action, toJS } from 'mobx';
import { isBrowser } from 'lib/common/isServer';
import localStorage from 'lib/common/localStorage';
import key from 'lib/constant/key';
import API from 'lib/API';

export default class KeywordStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }
  @observable MAX_ITEM = 10;
  @observable list = [];
  @observable autoComplete = true;
  @observable popularList = [];

  @action
  init = () => {
    const storageList = this.getListFromStorage();
    this.list = storageList || [];
    const complete = this.getAutocompleteFromStorage();
    this.autoComplete = complete === undefined ? true : complete;
  };

  @action
  getListFromStorage = () => {
    return localStorage.get(key.RECENTLY_KEYWORD_SEARCH);
  };

  @action
  getAutocompleteFromStorage = () => {
    return localStorage.get(key.AUTO_COMPLETE);
  };
  /**
   * 최근 검색어 추가
   * searchQuery를 이용하는 모든 부분에 추가해야 한다.
   * keyword와 검색 날짜를 저장 MM.DD 형태로 저장
   *
   * @param {string} keyword 키워드 이름
   * @param {string} date 검색 날짜 MM.DD 형태
   */

  @action
  addItem = (keyword = '') => {
    const isDuplicate =
      this.list.findIndex((item) => item.name === keyword) > -1;

    let keywordList = { name: keyword, date: this.mmdd() };

    // 중복 된 키워드가 있다면 삭제
    if (isDuplicate) {
      this.removeItem(keyword);
    }

    const listItem = Object.assign({}, keywordList);
    this.list.splice(0, 0, listItem);
    this.list = this.list.slice(0, this.MAX_ITEM);

    localStorage.set(key.RECENTLY_KEYWORD_SEARCH, toJS(this.list));
  };

  /**
   * 목록에서 원하는 최근 검색어 삭제
   */

  @action
  removeItem = (keyword = '') => {
    const targetItem = this.list.findIndex((item) => item.name === keyword);

    if (targetItem > -1) {
      this.list.splice(targetItem, 1);
      localStorage.set(key.RECENTLY_KEYWORD_SEARCH, toJS(this.list));
    }
  };

  /**
   * 최근 검색어 전체 삭제
   */

  @action
  removeItemAll = () => {
    this.list = [];
    localStorage.remove(key.RECENTLY_KEYWORD_SEARCH);
  };

  @action
  mmdd = () => {
    let date = new Date();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    return `${(mm > 9 ? '' : '0') + mm}.${(dd > 9 ? '' : '0') + dd}`;
  };

  @action
  setAutocomplete = () => {
    localStorage.set(key.AUTO_COMPLETE, !this.autoComplete);
    this.autoComplete = !this.autoComplete;
  };

  @action
  getPopularList = () => {
    API.search
      .get('/ps/keyword/popular', { params: { top: 10 } })
      .then((res) => {
        let data = res.data;
        this.popularList = data.data.keywords;
      });
  };

  @observable autoCompleteList = [];

  @action
  getAutoComplete = (value) => {
    let reg = /^[가-힣|a-z|A-Z|0-9|" "|\*]+$/;
    if (reg.test(value)) {
      API.search
        .get('/ps/search/autoComplete', { params: { searchQuery: value } })
        .then((res) => {
          let data = res.data;
          this.autoCompleteList = data.data.name;
        });
    }
  };
}

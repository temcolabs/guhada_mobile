import { observable, action, computed, toJS } from 'mobx';
import { isEqual as _isEqual } from 'lodash';
import API from 'childs/lib/API';

class Ranking {
  /**
   * statics
   */
  filterMaps = {
    sort: new Map([
      ['best', '인기 브랜드'],
      ['sell', '판매량 인기'],
      ['view', '브랜드 조회수'],
    ]),
    topCat: new Map([['all', '전체'], ['women', '여성'], ['men', '남성']]),
    cat: new Map([
      ['all', '전체'],
      ['clothing', '의류'],
      ['bags', '가방'],
      ['shoes', '신발'],
      ['accessories', '악세사리'],
      ['wallets', '지갑'],
    ]),
    interval: new Map([
      ['year', '연간'],
      ['month', '월간'],
      ['week', '주간'],
      ['day', '일간'],
      ['live', '실시간'],
    ]),
  };

  getBrandRankingUrl = (topCat, cat, interval) =>
    `/ps/rank/brand?sort=all&topCat=${topCat}&cat=${cat}&interval=${interval}`;
  getWordRankingUrl = (interval) =>
    `/ps/rank/word?sort=all&interval=${interval}`;

  createRankingFilterArray() {
    let rawFilters;
    switch (this.selectedRanking) {
      case 'brand':
        rawFilters = this.brandRankingFilters;
        break;
      case 'word':
        rawFilters = this.wordRankingFilters;
        break;
      default:
        return [];
    }
    const newRankingFilterArray = rawFilters.map(({ value }) => value);

    return newRankingFilterArray;
  }

  brandRankingFilterArray = [];
  wordRankingFilterArray = [];

  get rankingFilterArray() {
    switch (this.selectedRanking) {
      case 'brand':
        return this.brandRankingFilterArray;
      case 'word':
        return this.wordRankingFilterArray;
      default:
        return [];
    }
  }

  set rankingFilterArray(newArray) {
    switch (this.selectedRanking) {
      case 'brand':
        return (this.brandRankingFilterArray = newArray);
      case 'word':
        return (this.wordRankingFilterArray = newArray);
      default:
        return false;
    }
  }

  /**
   * observables
   */
  @observable selectedRanking = 'brand';

  @observable brandRanking = {
    updatedAt: 0,
    rank: [],
  };
  @observable wordRanking = {
    updatedAt: 0,
    rank: [],
  };

  @observable brandRankingFilters = [
    {
      filter: 'topCat',
      name: '성별',
      initial: 'all',
      value: 'all',
      dirty: false,
    },
    {
      filter: 'cat',
      name: '카테고리',
      initial: 'all',
      value: 'all',
      dirty: false,
    },
    {
      filter: 'interval',
      name: '기간',
      initial: 'day',
      value: 'day',
      dirty: false,
    },
  ];
  @observable wordRankingFilters = [
    {
      filter: 'interval',
      name: '기간',
      initial: 'day',
      value: 'day',
      dirty: false,
    },
  ];

  /**
   * computeds
   */
  @computed get ranking() {
    switch (this.selectedRanking) {
      case 'brand':
        return toJS(this.brandRanking);
      case 'word':
        return toJS(this.wordRanking);
      default:
        return {};
    }
  }

  @computed get rankingFilters() {
    switch (this.selectedRanking) {
      case 'brand':
        return this.brandRankingFilters;
      case 'word':
        return this.wordRankingFilters;
      default:
        return [];
    }
  }

  /**
   * actions
   */
  @action setSelectedRanking(name) {
    this.selectedRanking = name;
    this.fetchRanking();
  }

  @action setRankingFilter(idx, value) {
    let rankingFilters;
    switch (this.selectedRanking) {
      case 'brand':
        rankingFilters = this.brandRankingFilters;
        break;
      case 'word':
        rankingFilters = this.wordRankingFilters;
        break;
      default:
        return;
    }

    rankingFilters[idx] = { ...rankingFilters[idx], value, dirty: true };
    this.fetchRanking();
  }

  @action resetRankingFilter(idx) {
    let rankingFilters;
    switch (this.selectedRanking) {
      case 'brand':
        rankingFilters = this.brandRankingFilters;
        break;
      case 'word':
        rankingFilters = this.wordRankingFilters;
        break;
      default:
        return;
    }

    rankingFilters[idx] = {
      ...rankingFilters[idx],
      value: rankingFilters[idx].initial,
      dirty: false,
    };
    this.fetchRanking();
  }

  @action async fetchRanking() {
    const newRankingFilterArray = this.createRankingFilterArray();
    if (_isEqual(newRankingFilterArray, this.rankingFilterArray)) {
      return;
    }

    this.rankingFilterArray = newRankingFilterArray;

    let rankingUrl;
    let ranking;
    try {
      switch (this.selectedRanking) {
        case 'brand':
          rankingUrl = this.getBrandRankingUrl(...this.rankingFilterArray);
          ranking = this.brandRanking;
          break;
        case 'word':
          rankingUrl = this.getWordRankingUrl(...this.rankingFilterArray);
          ranking = this.wordRanking;
          break;
        default:
          throw new Error('EMPTY URL IS NOT ALLOWED');
      }

      const { data } = await API.search(rankingUrl);
      const { updatedAt, rank } = data.data;

      Object.assign(ranking, { updatedAt, rank });
    } catch (error) {
      console.error(error.message);
    }
  }
}

export default Ranking;

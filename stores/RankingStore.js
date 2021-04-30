import { observable, action, computed, toJS } from 'mobx';
import API from 'childs/lib/API';

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

class Ranking {
  /**
   * statics
   */
  filterMap = {
    sort: new Map([
      ['best', '인기 브랜드'],
      ['sell', '판매량 인기'],
      ['view', '브랜드 조회수'],
    ]),
    topCat: new Map([
      ['all', '전체'],
      ['women', '여성'],
      ['men', '남성'],
    ]),
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

  getRankingFilterArray() {
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
    const parsedFilters = rawFilters.map(({ value }) => value);

    return parsedFilters;
  }

  rankingFilterArray = [];

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
    console.log(
      'yoman COMPUTED ranking',
      this.selectedRanking,
      toJS(this.brandRanking),
      toJS(this.wordRanking)
    );
    switch (this.selectedRanking) {
      case 'brand':
        return this.brandRanking;
      case 'word':
        return this.wordRanking;
      default:
        return {};
    }
  }

  @computed get rankingFilters() {
    console.log(
      'yoman COMPUTED rankingFilters',
      this.selectedRanking,
      toJS(this.brandRankingFilters),
      toJS(this.wordRankingFilters)
    );
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
    console.log('yoman ACTION setSelectedRanking', name);
    this.selectedRanking = name;
    this.fetchRanking();
  }

  @action setRankingFilter(idx, value) {
    console.log('yoman ACTION setRankingFilter', idx, value);
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
    console.log('yoman ACTION resetRankingFilter', idx);
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

  @action
  async fetchRanking() {
    console.log('yoman ACTION fetchRanking');
    const newRankingFilterArray = this.getRankingFilterArray();
    if (arraysEqual(newRankingFilterArray, this.rankingFilterArray)) {
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

      console.log('yoman ACTION fetchRanking complete', toJS(ranking));
      Object.assign(ranking, { updatedAt, rank });
    } catch (error) {
      console.error(error.message);
    }
  }
}

export default Ranking;

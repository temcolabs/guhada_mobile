import API from 'childs/lib/API';

export default {
  /**
   * check for available feeds
   * ex) [{feedId: 1001, feedName: "NAVER"}]
   */
  matchFeedId: feedId => {
    return API.user.get('/feeds').then(res => {
      // console.log('RESULT', res);
      return res.data?.data.find(el => el.feedId === feedId);
    });
  },
};

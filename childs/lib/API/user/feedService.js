import API from 'childs/lib/API';

export default {
  /**
   * Check for available feeds
   * @param {number} feedId
   */
  verifyFeedId: feedId => {
    // return API.user.get('/feeds').then(res => {
    //   return res.data?.data.find(el => el.feedId === feedId);
    // });
    if (1000 < feedId && feedId < 1008) {
      return true;
    }
    return false;
  },
};

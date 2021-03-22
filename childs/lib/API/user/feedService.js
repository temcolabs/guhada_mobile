export default {
  /**
   * Check for available feeds
   * @param {number} feedId
   */
  verifyFeedId: feedId => {
    if (1000 < feedId && feedId < 1008) {
      return true;
    }
    return false;
  },
};

import { observable, action, computed } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';

class MyBBSStore {
  constructor(root, initialData = {}) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable
  isLoadingMyAcitivity = false;

  @observable
  isLoadingMyBookmark = false;

  // 나의 활동. 내가 쓴 글 + 댓글
  @observable
  myActivities = [];

  // 내가 북마크한 글 목록
  @observable
  myBookmarks = [];

  // 내가 쓴 글
  @computed
  get myArticles() {
    return this.myActivities.filter(m => m.contentsType === 'BBS');
  }

  @computed
  get isNoMyActivity() {
    return !this.isLoadingMyAcitivity && this.myActivities.length === 0;
  }

  // 내가 쓴 댓글
  @computed
  get myComments() {
    return this.myActivities.filter(m => m.contentsType === 'COMMENT');
  }

  @computed
  get isNoMyBookmark() {
    return !this.isLoadingMyBookmark && this.myBookmarks.length === 0;
  }

  @action
  getMyActivity = async ({ page = 1, unitPerPage = 10 } = {}) => {
    try {
      this.isLoadingMyAcitivity = true;

      const { data } = await API.bbs.get(`/activity/info`, {
        params: {
          page,
          unitPerPage,
        },
      });
      this.myActivities = data.data;
    } catch (e) {
      this.myActivities = [];
      console.error(e);
    } finally {
      this.isLoadingMyAcitivity = false;
    }
  };

  @action
  getMyBookmarks = async ({ unitPerPage = 10, page = 1 } = {}) => {
    try {
      this.isLoadingMyBookmark = true;

      const { data } = await API.bbs.get(`/bookmark`, {
        params: {
          page,
          unitPerPage,
        },
      });

      this.myBookmarks = data.data.content;
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoadingMyBookmark = false;
    }
  };
}

export default MyBBSStore;

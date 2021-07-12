import { observable, action, computed } from 'mobx';
import API from 'lib/API';
import _ from 'lodash';
import { root } from 'store';

class TempArticleStore {
  @observable list = [];

  @action emtpyList = () => {
    this.list = [];
  };

  @observable
  totalElements = 0;

  /**
   * 임시 저장 글 가져오기
   * TODO: 1페이지 10개만 가져오고 있음. 페이지네이션은 추후 구현
   *
   * https://dev.bbs.guhada.com/swagger-ui.html#/community-bbs-temp-controller/getCommunitiesUsingGET
   */
  @action
  getTempArticles = async ({
    page = 1,
    unitPerPage = 10,
    onSuccess = () => {},
  } = {}) => {
    // * response sample
    // "data": {
    //   "content": [
    //     {
    //        "id": 4,
    //        "brandId": 0,
    //        "brandName": "",
    //        "dealId": 0,
    //        "dealName": "",
    //        "title": "",
    //        "contents": "",
    //        "createdAt": [2019,8,5,9,32,31],
    //        "createdTimestamp": 1564997551000,
    //        "createdBy": "USER_281"
    //     }
    //   ],
    //   "pageable": {
    //     "sort": {
    //       "sorted": true,
    //       "unsorted": false,
    //       "empty": false
    //     },
    //     "pageSize": 10,
    //     "pageNumber": 0,
    //     "offset": 0,
    //     "paged": true,
    //     "unpaged": false
    //   },
    //   "totalElements": 0,
    //   "last": true,
    //   "totalPages": 0,
    //   "first": true,
    //   "sort": {
    //     "sorted": true,
    //     "unsorted": false,
    //     "empty": false
    //   },
    //   "numberOfElements": 0,
    //   "size": 10,
    //   "number": 0,
    //   "empty": true
    // },

    try {
      const { data } = await API.bbs.get(`/bbses/temp`, {
        params: {
          page,
          unitPerPage,
        },
      });

      this.list = data.data.content;
      this.totalElements = data.data.totalElements;
    } catch (e) {
      this.list = [];
      console.error(e);
    }
  };

  @action
  saveTempArticle = async ({
    data = {
      title: '',
      contents: '',
      brandId: 0,
      brandName: '',
      dealId: 0,
      dealName: '',
    },
    tempArticleId = null,
    onSuccess = () => {},
  }) => {
    const { brandId, brandName, contents, dealId, dealName, title } = data;
    const body = {
      brandId,
      brandName,
      contents,
      dealId,
      dealName,
      title,
    };

    try {
      const isNew = _.isNil(tempArticleId); // 새로운 임시 저장 데이터인지

      if (!isNew) {
        // 기존 임시 저장 데이터 삭제하고 새로 넣는다
        await API.bbs.delete(`/bbses/temp/${tempArticleId}`);
      }

      await API.bbs.post(`/bbses/temp`, body);

      root.alert.showAlert('임시 저장되었습니다.');

      onSuccess();
    } catch (e) {
      root.alert.showAlert('오류가 발생했습니다.');
      console.error(e);
    }
  };

  @action
  deleteTempArticle = async ({ id = null, onSuccess = () => {} }) => {
    try {
      await API.bbs.delete(`/bbses/temp/${id}`);

      this.getTempArticles();

      onSuccess();
    } catch (e) {
      root.alert.showAlert('오류가 발생했습니다.');
      console.error(e);
    }
  };
}

export default TempArticleStore;

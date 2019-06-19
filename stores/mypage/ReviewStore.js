import { observable, action } from 'mobx';
import API from 'lib/API';
import Axios from 'axios';
const isServer = typeof window === 'undefined';

export default class MypageReviewStore {
  @observable star;
  @observable size;
  @observable color;
  @observable length;

  @observable reviewContents;
  @observable photo;

  @observable availableReview = [];
  @observable availableReviewPage = 1;

  @action
  getAvailableReview = page => {
    API.order.get(`/order-review/available-review-order/${page}`).then(res => {
      if (res.data.resultCode === 200) {
        this.availableReview = res.data.data;
      }
    });
  };

  @action
  reviewSubmit = (
    productRating,
    sizeSatisfaction,
    colorSatisfaction,
    lengthSatisfaction,
    textReview = '',
    reviewFiles = '',
    orderProdGroupId,
    productId,
    closeModal = () => {}
  ) => {
    const color = ['BRIGHTER', 'SAME', 'DARKER'];
    const length = ['SHORT', 'REGULAR', 'LONG'];
    const size = ['SMALL', 'JUST_FIT', 'LARGE'];
    const rating = [
      'HALF',
      'ONE',
      'ONE_HALF',
      'TWO',
      'TWO_HALF',
      'THREE',
      'THREE_HALF',
      'FOUR',
      'FOUR_HALF',
      'FIVE',
    ];

    let formData = new FormData();

    formData.append('colorSatisfaction', color[colorSatisfaction]);
    formData.append('lengthSatisfaction', length[lengthSatisfaction]);
    formData.append('orderProductId', orderProdGroupId);
    formData.append('productId', productId);
    formData.append('productRating', rating[productRating - 1]);
    if (reviewFiles != '') {
      for (let i = 0; i < reviewFiles.length; i++) {
        formData.append('reviewFiles[' + i + ']', reviewFiles[i]);
      }
    }
    formData.append('sizeSatisfaction', size[sizeSatisfaction]);
    formData.append('textReview', textReview);

    API.user.post(`/products/${productId}/reviews`, formData).then(res => {
      if (res.data.resultCode === 200) {
        closeModal();
      }
    });
  };
}

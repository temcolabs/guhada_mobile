import { observable, action, toJS } from 'mobx';
import _ from 'lodash';

const isServer = typeof window === 'undefined';

export default class ProductDetailGalleryStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }

  @observable galleryImageItems = [];

  @action
  addGalleryImage = () => {
    const action = () => {
      this.galleryImageItems = this.root.productdetail.deals.imageUrls.map(
        data => {
          return { original: data };
        }
      );
      // console.log(this.galleryImageItems, 'this.galleryImageItems ');
    };

    if (_.isNil(_.get(this.root.productdetail, 'deals.imageUrls'))) {
      // 유저 정보가 없으면, 유저 정보를 가져온 후 실행할 액션에 추가해준다.
      this.root.productdetail.addFetched(action);
    } else {
      action();
    }
  };
}

import { observable, action, computed, toJS } from 'mobx';
import _ from 'lodash';
import API from 'childs/lib/API';
import { reviewModalType } from 'components/mypage/review/ReviewWriteModal';
import { isBrowser } from 'childs/lib/common/isServer';
import isFunction from 'childs/lib/common/isFunction';
import { uploadImagePath } from 'childs/lib/API/gateway/fileUploadService';
import { devLog } from 'childs/lib/common/devLog';

export default class MypageReviewStore {
  @observable star;
  @observable size;
  @observable color;
  @observable length;

  @observable reviewContents;
  @observable photo;

  @observable myReviews = []; // 내가 작성한 리뷰
  myReviewsPageSize = 5; // 페이지 사이즈

  @observable availableReview = []; // 작성 가능한 리뷰
  @observable availableReviewPage = 1;
  @observable orderItemList = [];
  // 서버로 부터 받은 것들
  @observable reviewPhotos = [];
  // 가공한 데이터
  @observable newReviewPhotos = [];

  @observable reviewPhotosFile = [];

  @observable deletedReviewPhotos = [];
  @observable deletedImagesFile = [];

  // 리뷰 데이터 단건
  @observable reviewData = null;

  // 리뷰를 작성할 주문 상품 데이터
  @observable orderProdGroup = null; // 리뷰를 작성 수정할 주문 데이터 한건. orderProdGroup

  constructor(root) {
    if (isBrowser) {
      this.root = root;
      this.root.productreview.getProductReviewPoint();
    }
  }

  @action async getReviewData({ productId, reviewId }) {
    try {
      const { data } = await API.user.get(
        `/products/${productId}/reviews/${reviewId}`
      );

      this.reviewData = data.data;
    } catch (e) {
      console.error(e);
    }
  }

  @action
  initReviewPhotos = (reviewPhotos = this.reviewPhotos) => {
    this.reviewPhotos = reviewPhotos;
    this.newReviewPhotos = reviewPhotos;
    this.clearPhotoFile();
    this.clearDeletedFile();
    devLog('toJS(reviewPhotos)', toJS(reviewPhotos));
    for (let i = 0; i < reviewPhotos.length; i++) {
      this.reviewPhotosFile.push({
        file: '',
      });
    }
  };

  @action
  clearReviewPhotos = () => {
    this.reviewPhotos = [];
    this.newReviewPhotos = [];
    this.clearPhotoFile();
    this.clearDeletedFile();
  };

  @action
  clearPhotoFile = () => {
    this.reviewPhotosFile = [];
  };

  @action
  clearDeletedFile = () => {
    this.deletedReviewPhotos = [];
    this.deletedImagesFile = [];
  };

  @action
  deletedImages = images => {
    this.deletedReviewPhotos = images;
  };

  @action
  deletedFile = files => {
    this.deletedImagesFile = files;
  };

  @action
  setReviewPhotos = reviewPhotos => {
    let orderPhotos = reviewPhotos;

    orderPhotos.map((data, index) => {
      data.photoOrder = index;
    });

    this.newReviewPhotos = orderPhotos;
  };

  @action
  setReviewPhotosFile = imageFile => {
    this.reviewPhotosFile = imageFile;
  };

  @action
  getAvailableReview = (page = 1) => {
    API.order
      .get(`/order-review/available-review-order/${page}`)
      .then(res => {
        // this.availableReview = this.availableReview.concat(res.data.data);
        this.availableReview = res.data.data;
        this.orderItemList = this.orderItemList.concat(
          res.data?.data?.orderItemList
        );
        console.log('this.availableReview', this.availableReview);
      })
      .catch(e => {
        this.availableReview = [];
      });
  };

  /**
   * 새 리뷰 작성
   */
  @action
  reviewSubmit = ({
    reviewData,
    orderProdGroupId,
    productId,
    sellerId,
    onSuccess = ({ data = {} } = {}) => {}, // res.data.data
  }) => {
    let reviewPhotos = [];

    API.user
      .get(`/products/reviews/image-upload-url`)
      .then(res => {
        let ImageUploadUrl = res.data.data;

        if (this.newReviewPhotos !== []) {
          let networkRequestPromises = this.reviewPhotosFile.map(
            reviewPhotosFile => {
              if (reviewPhotosFile.name) {
                return uploadImagePath({
                  file: reviewPhotosFile,
                  uploadPath: ImageUploadUrl,
                })
                  .then(({ url }) => {
                    return { url };
                  })
                  .catch(e => {
                    console.error(e);
                  });
              } else {
                return { reviewPhotosFile };
              }
            }
          );

          Promise.all(networkRequestPromises)
            .then(urls => {
              urls.map((urls, i) => {
                return reviewPhotos.push({
                  imageStatus: this.newReviewPhotos[i].imageStatus,
                  photoOrder: this.newReviewPhotos[i].photoOrder,
                  reviewPhotoUrl: urls.url,
                });
              });

              API.user
                .post(`/products/${productId}/reviews`, {
                  colorSatisfaction: reviewData.colorSatisfaction,
                  lengthSatisfaction: reviewData.lengthSatisfaction,
                  orderProductGroupId: orderProdGroupId,
                  productRating: reviewData.productRating,
                  reviewPhotos: reviewPhotos,
                  sellerId: sellerId,
                  sizeSatisfaction: reviewData.sizeSatisfaction,
                  textReview: reviewData.textReview,
                })
                .then(res => {
                  if (isFunction(onSuccess)) {
                    onSuccess({ data: res.data?.data });
                  }
                })
                .catch(e => {
                  this.root.alert.showAlert(_.get(e, 'res.data.message'));
                });
            })
            .catch(e => {
              console.log(e);
            });
        }
      })
      .catch(e => {
        this.root.alert.showAlert(
          _.get(e, 'data.result') || '오류가 발생했습니다'
        );
      });
  };

  @action
  reviewModify = ({
    reviewData,
    orderProdGroupId,
    productId,
    sellerId,
    onSuccess,
  }) => {
    let reviewPhotos = [];

    API.user.get(`/products/reviews/image-upload-url`).then(res => {
      let ImageUploadUrl = res.data.data;
      let networkRequestPromises;

      if (this.reviewPhotosFile !== []) {
        networkRequestPromises = this.reviewPhotosFile.map(reviewPhotosFile => {
          if (reviewPhotosFile.name) {
            return uploadImagePath({
              file: reviewPhotosFile,
              uploadPath: ImageUploadUrl,
            })
              .then(({ url }) => {
                return { url };
              })
              .catch(e => {
                console.error(e);
              });
          } else {
          }
        });
      }

      Promise.all(networkRequestPromises)
        .then(urls => {
          urls.map((urls, i) => {
            return reviewPhotos.push({
              id:
                _.isNil(this.newReviewPhotos[i].id) === false
                  ? this.newReviewPhotos[i].id
                  : '',
              imageStatus: this.newReviewPhotos[i].imageStatus,
              photoOrder: this.newReviewPhotos[i].photoOrder,
              reviewPhotoUrl:
                _.isNil(urls) === false
                  ? urls.url
                  : this.newReviewPhotos[i].reviewPhotoUrl,
            });
          });

          if (this.deletedReviewPhotos !== []) {
            this.deletedReviewPhotos.map((deletedPhotosFile, i) => {
              reviewPhotos.push({
                id: deletedPhotosFile.id,
                imageStatus: deletedPhotosFile.imageStatus,
                photoOrder: deletedPhotosFile.photoOrder,
                reviewPhotoUrl: deletedPhotosFile.reviewPhotoUrl,
              });
            });
          }

          API.user
            .put(`/products/${productId}/reviews/${reviewData.id}`, {
              colorSatisfaction: reviewData.colorSatisfaction,
              lengthSatisfaction: reviewData.lengthSatisfaction,
              orderProductGroupId: orderProdGroupId,
              productRating: reviewData.productRating,
              reviewPhotos: reviewPhotos,
              sellerId: sellerId,
              sizeSatisfaction: reviewData.sizeSatisfaction,
              textReview: reviewData.textReview,
            })
            .then(res => {
              if (isFunction(onSuccess)) {
                onSuccess({ data: res.data?.data });

                this.root.alert.showAlert('리뷰가 수정되었습니다.');
              }
            })
            .catch(e => {
              this.root.alert.showAlert(_.get(e, 'res.data.message'));
            });
        })
        .catch(e => {
          console.log(e);
        });
    });
  };

  reviewDelete = (reviewdata, closeModal) => {
    let review = reviewdata.review;
    API.user
      .delete(`/products/${review.productId}/reviews/${review.id}`)
      .then(res => {
        closeModal();
        this.getMyReviews();
        this.getAvailableReview();
      });
  };

  @action
  getMyReviews = (page = 1) => {
    API.user
      // 페이지 번호는 0부터 시작한다
      .get(
        `/users/my-page/reviews?page=${page - 1}&size=${this.myReviewsPageSize}`
      )
      .then(res => {
        this.myReviews = res.data.data;
      })
      .catch(e => {
        this.myReviews = [];
      });
  };

  @observable isReviewModalOpen = false; // 리뷰 작성 모달 오픈 여부
  @observable reviewModalType = null;

  // 리뷰 작성 모달 상태 제어
  @action
  setIsReviewModalOpen = ({ isOpen = false, type = reviewModalType.WRITE }) => {
    this.isReviewModalOpen = isOpen;
    this.reviewModalType = type;
  };

  @action
  closeReviewModal = () => {
    this.setIsReviewModalOpen({ isOpen: false, type: null });
    this.orderProdGroup = null;
    this.reviewData = null;
  };

  // 리뷰 새로 작성 모달 오픈 여부
  @computed
  get isReviewWriteModalOpen() {
    return (
      this.isReviewModalOpen && this.reviewModalType === reviewModalType.WRITE
    );
  }

  // 리뷰 수정 모달 오픈 여부
  @computed
  get isReviewModifyModalOpen() {
    return (
      this.isReviewModalOpen && this.reviewModalType === reviewModalType.MODIFY
    );
  }

  @action
  setOrderProdGroup(order) {
    this.orderProdGroup = order;
  }

  @observable isPossibleSetUserSize;
  @action
  checkUserSize = () => {
    if (this.isPossibleSetUserSize !== false) {
      API.user
        .get(`users/user-size`)
        .then(res => {
          this.isPossibleSetUserSize = false;
        })
        .catch(e => {
          if (_.get(e, 'data.resultCode') === 5004) {
            this.isPossibleSetUserSize = true;
          }
        });
    }
  };
}

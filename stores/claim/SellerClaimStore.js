import { observable, action, computed } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { sendBackToLogin } from 'childs/lib/router';
import { isImageFile } from 'childs/lib/common/isImageFile';
import { uploadImageFile } from 'childs/lib/API/gateway/fileUploadService';
import { devLog } from 'childs/lib/common/devLog';
/**
 * 판매자 문의하기 관련
 */
export default class SellerClaimStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  // 셀러에게 주문한 상품들
  @observable myDealsOrdered = [];
  @observable isPossible = false;
  @observable sellerClaimTypes = [];
  @observable attachImageUrls = [];
  @observable orderProdGroupId = 0;
  @observable claimType = null;
  @action
  checkIsSellerClaimPossible = (sellerId, inquiryHandle) => {
    // 판매자 문의는 로그인 상태에서만 가능하다.
    if (!this.root.login.isLoggedIn) {
      sendBackToLogin();
    }

    API.order
      .get(`/order-review/seller-inquire-order`, {
        params: {
          sellerId,
        },
      })
      .then(res => {
        devLog(res, 'res /order-review/seller-inquire-order');
        if (res.data.data.length > 0) {
          this.isPossible = true;
          this.myDealsOrdered = res.data.data;

          if (!this.sellerClaimTypes?.length > 0) {
            API.claim
              .get(`/users/seller-claims/types`)
              .then(res => {
                this.sellerClaimTypes = res.data.data;
              })
              .catch(err => {
                console.log(err, 'sellerClaimTypes err');
              });
          }
        } else {
          this.root.alert.showConfirm({
            content:
              '해당 판매자에게 주문한 기록을 찾을 수 없습니다. 상품 문의를 통해서만 문의가 가능합니다.',
            cancelText: '취소',
            confirmText: '상품 문의하기',
            onConfirm: () => {
              inquiryHandle();
            },
          });
        }
      })
      .catch(err => {
        console.log(err, '판매자문의하기 조회 err');
      });
  };

  @action
  closeClaim = () => {
    this.isPossible = false;
  };

  @action
  setOrderGroupId = value => {
    this.orderProdGroupId = value.value.orderProdGroupId;
  };

  @action
  setClaimType = value => {
    this.claimType = value.value;
  };

  // 모달의 select 컴포넌트에서 사용할 옵션
  @computed
  get myDealsOptions() {
    return this.myDealsOrdered?.map((order = {}) => ({
      label: order.productName,
      value: {
        // 셀렉트 옵션에서 사용할 데이터
        orderProdGroupId: order.orderProdGroupId,
        imageUrl: order.imageUrl,
        productName: order.productName,
        brandName: order.brandName,
        quantity: order.quantity,
        optionAttribute1: order.optionAttribute1,
        optionAttribute2: order.optionAttribute2,
        optionAttribute3: order.optionAttribute3,
        orderTimestamp: order.orderTimestamp,
        purchaseStatusText: order.statusText,
      },
    }));
  }

  @computed
  get sellerClaimTypeOptions() {
    return this.sellerClaimTypes?.map(claimType => ({
      label: claimType.description,
      value: claimType.name,
    }));
  }

  @action
  uploadImage = (e, setAttachImageArray) => {
    let files = e.target.files;
    if (files && isImageFile(files[0])) {
      uploadImageFile({
        file: files[0],
        uploadPath: ['USER_SELLER_CLAIM'],
      })
        .then(res => {
          setAttachImageArray(res.url);
        })
        .catch(e => {
          console.error(e);
        });
    }
  };

  @action
  deleteImage = url => {
    API.gateway
      .delete(`/upload/image`, {
        params: {
          imgUrl: url,
        },
      })
      .then(res => {
        devLog(res, ' delete image');
      })
      .catch(err => {
        console.log(err);
      });
  };

  @action
  createSellerClaim = (title, claim, attachImage, sellerId) => {
    let userId = this.root.user.userId;
    let body = {
      contents: claim,
      imageUrls: attachImage,
      orderProdGroupId: this.orderProdGroupId,
      sellerId: sellerId,
      title: title,
      type: this.claimType,
    };

    API.claim
      .post(`/users/${userId}/seller-claims`, body)
      .then(res => {
        this.root.alert.showAlert('판매자 문의가 등록되었습니다.');
        this.closeClaim();
      })
      .catch(err => {
        console.log(err);
      });
  };
}

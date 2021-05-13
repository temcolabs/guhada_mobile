import { observable, action, computed } from 'mobx';
import { isBrowser } from 'childs/lib/common/isServer';
import API from 'childs/lib/API';
import { sendBackToLogin } from 'childs/lib/router';
import { isImageFile } from 'childs/lib/common/isImageFile';
import { uploadImageFile } from 'childs/lib/API/gateway/fileUploadService';
import { devLog } from 'childs/lib/common/devLog';
import isFunction from 'childs/lib/common/isFunction';

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
  @observable sellerId = null; // 타겟 셀러아이디
  @observable isPossible = false; // 판매자문의 작성이 가능한지
  @observable sellerClaimTypes = [];
  @observable attachImageUrls = [];
  @observable orderProdGroupId = 0;
  @observable claimType = null;

  // 판매자 문의 입력 관련 데이터 초기화
  @action resetSellerClaimData = () => {
    this.sellerId = null;
    this.myDealsOrdered = [];
    this.attachImageUrls = [];
    this.orderProdGroupId = 0;
    this.claimType = null;
  };

  /**
   * 판매자 문의 모달을 열기 위한 데이터를 가져온다.
   *
   * @param isPossible 판매자 문의가 가능한지
   * @param onPossible 판매자 문의가 가능할 때 콜백
   * @param onImpossible 판매자 문의가 불가능할 때 콜백
   */
  @action
  checkIsSellerClaimPossible = async ({
    sellerId,
    onPossible = () => {},
    onImpossible = () => {},
  }) => {
    // 판매자 문의는 로그인 상태에서만 가능하다.
    if (!this.root.login.isLoggedIn) {
      sendBackToLogin();
      return;
    }

    // 이미 타겟 셀러아이디에 대한 확인을 끝냈다면 API 추가 실행하지 않는다
    if (this.sellerId === sellerId && this.isPossible === true) {
      isFunction(onPossible) && onPossible();
      return;
    }

    try {
      // 셀러클레임 타입 가져오기. 1번만 가져오면 됨
      if (!this.sellerClaimTypes?.length > 0) {
        const { data } = await API.claim.get(`/users/seller-claims/types`);
        this.sellerClaimTypes = data.data;
      }

      const { data } = await API.order.get(
        `/order-review/seller-inquire-order`,
        {
          params: {
            sellerId,
          },
        }
      );

      // 유저가 셀러에게 구입한 상품이 있다면
      if (data.data.length > 0) {
        this.sellerId = sellerId;
        this.isPossible = true;
        this.myDealsOrdered = data.data;
        isFunction(onPossible) && onPossible();
      } else {
        this.resetSellerClaimData();
        isFunction(onImpossible) && onImpossible();
      }
    } catch (err) {
      console.error(err, '판매자문의하기 조회 err');
      this.resetSellerClaimData();
      isFunction(onImpossible) && onImpossible();
    }
  };

  @action
  disableSellerClaim = (reset = true) => {
    this.isPossible = false;
    if (reset) {
      this.resetSellerClaimData();
    }
  };

  @action
  setOrderGroupId = (value) => {
    this.orderProdGroupId = value.value.orderProdGroupId;
  };

  @action
  setClaimType = (value) => {
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
    return this.sellerClaimTypes?.map((claimType) => ({
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
        .then((res) => {
          setAttachImageArray(res.url);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  @action
  deleteImage = (url) => {
    API.gateway
      .delete(`/upload/image`, {
        params: {
          imgUrl: url,
        },
      })
      .then((res) => {
        devLog(res, 'delete image');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  @action
  createSellerClaim = async (title, claim, attachImage, sellerId) => {
    try {
      let userId = this.root.user.userId;
      let body = {
        contents: claim,
        imageUrls: attachImage,
        orderProdGroupId: this.orderProdGroupId,
        sellerId: sellerId,
        title: title,
        type: this.claimType,
      };

      await API.claim.post(`/users/${userId}/seller-claims`, body);
      this.root.alert.showAlert('판매자 문의가 등록되었습니다.');
    } catch (e) {
      this.root.alert.showAlert('오류가 발생했습니다.');
      console.error(e);
    }
  };
}

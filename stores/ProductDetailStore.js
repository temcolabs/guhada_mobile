import { observable, action, toJS } from 'mobx';
import Axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { configureActions } from '@storybook/addon-actions/dist/preview';
import API from 'lib/API';
import { key } from 'constant';

const isServer = typeof window === 'undefined';
export default class ProductDetailStore {
  @observable deals;
  @observable dealsStatus = false;
  @observable detailGallery = {
    moveIndex: 0,
    zoomImg: undefined,
    leftArrow: false,
    rightArrow: true,
  };

  @observable dealsTag = [];
  @observable seletctedTab = 'detail';
  @observable notifiesTable = [];
  @observable filtersTable = [];

  @observable askPageNumber = '';
  @observable claims;
  @observable businessSeller;
  @observable dealsOfSameBrand;
  @observable dealsOfRecommend;
  @observable dealsOfSellerStore;

  constructor(root) {
    if (!isServer) this.root = root;
  }

  @action
  getDeals = id => {
    API.product.get(`/deals/ ${id}`).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.deals = data.data;
        this.root.productoption.getShipExpenseType();
        this.root.productoption.getOptions();
        this.getDealsTag();

        this.dealsStatus = true;

        // 다른 서비스 api로 데이터 받아오는 부분
        this.getClaimData();
        this.getBusinessSeller();
        this.getDealsOfSameBrand();
        this.getDealsOfRecommend();
        this.getSellerStore();
        this.getInquiryDetail();
        this.getFollowers();
        this.getSatisfaction();
        this.getSellerDetail();
        this.root.productreview.getProductReview();
        this.root.productreview.getProductReviewSummary();
        // 데이터 테이블 형태로 가공해야 하는 attributes
        this.initTableData();
        // this.dealsStatus = true;
        this.deals.dealsId = id;
        this.getBlockChainData();
      }
    });
  };

  @observable blockChainData;

  @action
  getBlockChainData = () => {
    let Header = {
      method: 'GET',
      url:
        'http://ec2-52-79-95-78.ap-northeast-2.compute.amazonaws.com:8080/guhada/blockchain/transact-Data/' +
        this.deals.productId,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    Axios(Header).then(res => {
      if (res.status === 200) {
        this.blockChainData = res.data;
      }
    });
  };

  @action
  initTableData = () => {
    this.notifiesTable = [];
    this.filtersTable = [];
    // 상품 고시 정보 목록
    this.setTableData(this.deals.productNotifies, this.notifiesTable);
    // 상품 정보 > 필터 목록
    this.setTableData(this.deals.filters, this.filtersTable);
  };

  @action
  pagerLeftMove = () => {
    let sNum = this.deals.imageUrls.length;
    if (sNum - this.detailGallery.moveIndex <= sNum) {
      return false;
    } else {
      if (this.detailGallery.moveIndex === -1) {
        this.detailGallery.leftArrow = false;
        this.detailGallery.moveIndex = this.detailGallery.moveIndex + 1;
      } else {
        this.detailGallery.leftArrow = true;
        this.detailGallery.rightArrow = true;
        this.detailGallery.moveIndex = this.detailGallery.moveIndex + 1;
      }
    }
  };

  @action
  pagerRightMove = () => {
    let sNum = this.deals.imageUrls.length;
    if (sNum + this.detailGallery.moveIndex <= 6) {
      return false;
    } else {
      if (6 - this.detailGallery.moveIndex === sNum - 1) {
        this.detailGallery.rightArrow = false;
        this.detailGallery.moveIndex = this.detailGallery.moveIndex - 1;
      } else {
        this.detailGallery.rightArrow = true;
        this.detailGallery.leftArrow = true;
        this.detailGallery.moveIndex = this.detailGallery.moveIndex - 1;
      }
    }
  };
  @action
  zoomImg = src => {
    this.detailGallery.zoomImg = src;
  };

  @action
  setProductGalleryInit = () => {
    this.detailGallery = {
      moveIndex: 0,
      zoomImg: undefined,
      leftArrow: false,
      rightArrow: true,
    };
  };

  @action
  getDealsTag = () => {
    if (this.deals.tag) {
      let tagArray = [];
      tagArray = this.deals.tag.split('/');

      this.dealsTag = tagArray;
    }
  };

  @action
  setSeletctTab = select => {
    this.seletctedTab = select;
  };

  //// example to use setTableData
  // this.setTableData(this.deals.productNotifies, this.notifiesTable);

  @action
  setTableData = (raw, tableData) => {
    if (raw) {
      let productNotifiesLength = raw.length;
      let arrayLength =
        productNotifiesLength % 2
          ? parseInt(productNotifiesLength / 2) + 1
          : parseInt(productNotifiesLength / 2);

      for (let i = 0; i < arrayLength; i++) {
        tableData.push([]);
      }

      for (let i = 0; i < productNotifiesLength; i++) {
        tableData[parseInt(i / 2)].push(raw[i]);
      }
    }
  };

  @action
  setAskPageNumber = id => {
    this.askPageNumber = id;
  };

  @observable layoutFixedStyle = {
    position: 'relative',
  };

  @observable optionFixedStyle = {
    position: 'relative',
  };

  @observable fixedWidth = {
    width: 'calc(100% - 287px)',
  };

  @action
  tabInfoFixed = e => {
    const paymentSide = document.querySelector('.productdetail__tab__lisner');
    if (paymentSide) {
      const paymentSideRect = paymentSide.getBoundingClientRect();
      let paymentSideTop = paymentSideRect.top;

      if (paymentSideTop < 0) {
        this.layoutFixedStyle = {
          position: 'fixed',
        };

        this.fixedWidth = {
          width: 'calc(100% - 287px - 120px)',
        };

        this.optionFixedStyle = {
          position: 'fixed',
          top: '70px',
        };
      } else {
        this.layoutFixedStyle = {
          position: 'relative',
        };

        this.fixedWidth = {
          width: 'calc(100% - 287px)',
        };

        this.optionFixedStyle = {
          position: 'relative',
          top: '0px',
        };
      }
    }
  };

  // productInquiry

  @observable inquiryList = [];
  @observable inquiryPage = 0;

  @observable inquiryNavCount;

  @observable inquiryLastPage;
  @observable inquiryLastPageIndex;
  @observable inquiryNextPageIndex;
  @observable inquiryPreviousPageIndex;

  @observable inquiryStatus = '';
  @observable inquiryMy = false;

  @observable itemCountOfDeals;
  @observable unitPerPage = 10;
  @observable pageList = [];
  @action
  getInquiry = (page, id, status, myinquiry = this.inquiryMy) => {
    this.inquiryMy = myinquiry;
    this.inquiryStatus = status;
    let accessToken = Cookies.get(key.ACCESS_TOKEN);

    API.claim
      .get('/products/' + id + '/inquiries', {
        params: {
          pageNo: page,
          size: 10,
          status: this.inquiryStatus,
          isMyInquiry: this.inquiryMy,
        },
      })
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.inquiryList = data.data;
          this.inquiryPage = page + 1;
          this.setInquiryPageNavigation(data.data);
          this.pageNavigator(data.data.totalElements, 10);
        } else if (data.resultCode === 5004) {
          this.inquiryList = [];
          this.initPageList();
        }
      });
  };

  @action
  initPageList = () => {
    this.pageList = [];
  };

  @observable seller;
  @action
  getSellerDetail = () => {
    API.user.get('/sellers/' + this.deals.sellerId).then(res => {
      let data = res.data;
      if (data.resultCode === 200) {
        this.seller = data.data;
        // console.log('data', data);
      }
    });
  };
  @observable inquiryDetail;
  @action
  getInquiryDetail = () => {
    API.user
      .get('/sellers/' + this.deals.sellerId + '/inquiry-details')
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.inquiryDetail = data.data;
        }
      });
  };

  @observable followers;
  @action
  getFollowers = () => {
    // TODO: 로그인 로직 나올 시 수정 필요

    // this.root.login.decodeLoginData(Cookies.get('accessToken'));

    let loginInfo = this.root.login.loginInfo;

    if (loginInfo.userId !== undefined) {
      API.user
        .get(
          '/sellers/' + this.deals.sellerId + '/followers/' + loginInfo.userId
        )
        .then(res => {
          let data = res.data;
          if (data.resultCode === 200) {
            this.followers = data.data;
          }
        });
    }
  };

  @observable satisfaction;
  @action
  getSatisfaction = () => {
    API.user
      .get('/sellers/' + this.deals.sellerId + '/purchase-satisfaction')
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.satisfaction = data.data;
        }
      });
  };

  @action
  setInquiryPageNavigation = data => {
    this.inquiryLastPage = data.totalPages;
    this.inquiryLastPageIndex = parseInt(data.totalPages / 10) * 10;
    this.inquiryNextPageIndex = (parseInt(this.inquiryPage / 10) + 1) * 10;
    this.inquiryPreviousPageIndex = (parseInt(this.inquiryPage / 10) - 1) * 10;

    this.inquiryNavCount = parseInt(this.inquiryPage / 10);

    if (this.inquiryPage % 10 === 0) {
      this.inquiryNavCount -= 1;
      this.inquiryNextPageIndex -= 10;
      this.inquiryPreviousPageIndex -= 1;
    }

    if (this.inquiryNextPageIndex > this.inquiryLastPageIndex) {
      this.inquiryNextPageIndex = this.inquiryLastPage - 1;
      this.inquiryLastPageIndex = this.inquiryLastPage - 1;
    }

    if (this.inquiryPreviousPageIndex < 1) {
      this.inquiryPreviousPageIndex = 0;
    }
  };

  @action
  pageNavigator = (itemCountOfDeals, unitPerPage) => {
    this.itemCountOfDeals = itemCountOfDeals;
    this.unitPerPage = unitPerPage;
    let listCount = parseInt(this.itemCountOfDeals / this.unitPerPage) + 1;

    this.initPageList();
    for (let i = 0; i < listCount; i++) {
      this.pageList.push(i);
    }
  };

  @observable secretInquiry = false;
  @observable inquiryContents = '';

  @action
  setInquiryContents = inquiryContents => {
    this.inquiryContents = inquiryContents;
  };

  @action
  setSecretInquiry = secretInquiry => {
    this.secretInquiry = secretInquiry;
  };

  @action
  setNewInquiry = (id, closeModal) => {
    let accessToken = Cookies.get(key.ACCESS_TOKEN);

    API.claim
      .post('/products/' + id + '/inquiries', {
        content: this.inquiryContents,
        private: this.secretInquiry,
      })
      .then(res => {
        let data = res.data;

        if (data.resultCode === 200) {
          this.getInquiry(0, id, '');
          closeModal();
        }
      });
  };

  @action
  getClaimData = () => {
    if (this.deals.sellerId && this.deals.shipping.claimAddressId) {
      API.user
        .get(
          `/sellers/${this.deals.sellerId}/departures-and-returns/${
            this.deals.shipping.claimAddressId
          }`
        )
        .then(res => {
          let data = res.data;
          if (data.resultCode === 200) {
            this.claims = data.data;
          }
        });
    }
  };

  @action
  getBusinessSeller = () => {
    API.user
      .get(`/sellers/business-user?seller-id=${this.deals.sellerId}`)
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.businessSeller = data.data;
          // console.log('this.businessSeller', this.businessSeller);
        }
      });
  };

  @action
  getDealsOfSameBrand = () => {
    API.product
      .get(`/deals?brandId=${this.deals.brandId}&pageIndex=0&unitPerPage=3`)
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.dealsOfSameBrand = data.data;
        }
      });
  };

  @action
  getDealsOfRecommend = () => {
    API.product
      .get(
        `/deals?division=RECOMMEND&pageIndex=0&unitPerPage=3&sellerId=${
          this.deals.sellerId
        }`
      )
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.dealsOfRecommend = data.data;
        }
      });
  };

  @action
  getSellerStore = () => {
    API.product
      .get(`/deals?sellerId=${this.deals.sellerId}&pageIndex=0&unitPerPage=10`)
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.dealsOfSellerStore = data.data;
        }
      });
  };
}

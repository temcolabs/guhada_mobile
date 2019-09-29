import { observable, action } from 'mobx';
import Axios from 'axios';
import API from 'lib/API';
import { pushRoute } from 'lib/router';
import _ from 'lodash';
import { devLog } from 'lib/devLog';

const isServer = typeof window === 'undefined';
export default class ProductDetailStore {
  constructor(root) {
    if (!isServer) this.root = root;
  }
  @observable deals;
  @observable dealsStatus = false;

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

  actionAfterUserInfoFetched = [];
  @action
  getDeals = id => {
    API.product
      .get(`/deals/${id}`)
      .then(res => {
        let data = res.data;
        this.deals = data.data;
        this.root.productoption.getShipExpenseType();
        this.root.productoption.getOptions();
        this.getDealsTag();
        this.root.productDetailBookmark.getBookMark(this.deals.productId);

        while (this.actionAfterUserInfoFetched.length > 0) {
          const cb = this.actionAfterUserInfoFetched.pop();

          if (typeof cb === 'function') {
            cb();
          }
        }
        console.log(this.deals, 'this.deals');
        // 다른 서비스 api로 데이터 받아오는 부분
        this.getClaimData();
        this.getBusinessSeller();
        this.getDealsOfSameBrand();
        this.getDealsOfRecommend();
        this.getSellerStore();
        this.getSellerStoreDeals();
        this.getInquiryDetail();
        // this.getFollowers();
        this.root.sellerfollow.getSellerFollow(this.deals.sellerId);
        this.getSatisfaction();
        this.getSellerDetail();
        this.root.productreview.getProductReview();
        this.root.productreview.getProductReviewSummary();
        this.getInquiry(0);
        // 데이터 테이블 형태로 가공해야 하는 attributes
        this.initTableData();
        // this.dealsStatus = true;
        this.deals.dealsId = id;
        // this.getBlockChainData();

        // 혜택정보
        this.root.productoption.getBenefitData();
        this.root.productoption.getCouponData();

        sessionStorage.removeItem('paymentInfo');

        this.dealsStatus = true;
      })
      .catch(e => {
        if (e.status === 200) {
          if (_.get(e, 'data.resultCode') === 8404) {
            this.root.alert.showAlert({
              content: _.get(e, 'data.message'),
              onConfirm: () => {
                pushRoute('/');
              },
            });
          }
        }
      });
  };

  @action
  addFetched = fn => {
    this.actionAfterUserInfoFetched = this.actionAfterUserInfoFetched.concat(
      fn
    );
  };

  @observable blockChainData;

  @action
  getBlockChainData = () => {
    let Header = {
      method: 'GET',
      url:
        'https://ec2-52-79-95-78.ap-northeast-2.compute.amazonaws.com:8080/guhada/blockchain/transact-Data/' +
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
  getDealsTag = () => {
    if (this.deals.tag) {
      let tagArray = [];
      tagArray = this.deals.tag.split('/');

      this.dealsTag = tagArray;
    } else {
      this.dealsTag = [];
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
  @observable inquiryPage = 0;

  @action
  getInquiry = (page, status, myinquiry = this.inquiryMy) => {
    this.inquiryMy = myinquiry;
    this.inquiryStatus = status;
    this.inquiryPage = 0;

    API.claim
      .get('/products/' + this.deals.productId + '/inquiries', {
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
        }
      })
      .catch(e => {
        this.inquiryList = [];
      });
  };

  @action
  addInquiry = (status, myinquiry = this.inquiryMy) => {
    this.inquiryMy = myinquiry;
    this.inquiryStatus = status;

    this.inquiryPage += 1;
    API.claim
      .get('/products/' + this.deals.productId + '/inquiries', {
        params: {
          pageNo: this.inquiryPage,
          size: 10,
          status: this.inquiryStatus,
          isMyInquiry: this.inquiryMy,
        },
      })
      .then(res => {
        let data = res.data;

        if (data.resultCode === 200) {
          let newInquiry = this.inquiryList.content;
          this.inquiryList.content = newInquiry.concat(data.data.content);
        } else
          this.root.alert.showAlert({
            content: '문의 데이터가 더 이상 존재하지 않습니다.',
          });
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
  setNewInquiry = (content, closeModal) => {
    API.claim
      .post('/products/' + this.deals.productId + '/inquiries', {
        content: content,
        privateInquiry: this.secretInquiry,
      })
      .then(res => {
        let data = res.data;

        if (data.resultCode === 200) {
          this.getInquiry(0, '');
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
        }
      });
  };

  @action
  getDealsOfSameBrand = () => {
    API.search
      .post(
        `/ps/search/seller/related`,
        { productId: this.deals.productId },
        { params: { page: 1, unitPerPage: 3 } }
      )
      .then(res => {
        let data = res.data;
        this.dealsOfSameBrand = data.data.deals;
      });
  };

  @action
  getDealsOfRecommend = () => {
    API.search
      .post(
        `/ps/search/seller/popular`,
        { productId: this.deals.productId },
        { params: { page: 1, unitPerPage: 3 } }
      )
      .then(res => {
        let data = res.data;
        this.dealsOfRecommend = data.data.deals;
      });
  };
  @observable sellerStore;
  @action
  getSellerStore = () => {
    API.user
      .get(`sellers/${this.deals.sellerId}/store`)
      .then(res => {
        let data = res.data;
        this.sellerStore = data.data;
      })
      .catch(e => {
        devLog('getSellerStore', e);
      });
  };
  @action
  getSellerStoreDeals = () => {
    API.product
      .get(`/deals?sellerId=${this.deals.sellerId}&pageIndex=0&unitPerPage=9`)
      .then(res => {
        let data = res.data;
        if (data.resultCode === 200) {
          this.dealsOfSellerStore = data.data;
        }
      });
  };
}

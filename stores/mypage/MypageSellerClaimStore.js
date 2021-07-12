import { observable, action, computed } from 'mobx';
import { isBrowser } from 'lib/common/isServer';
import userSellerClaimService from 'lib/API/claim/userSellerClaimService';
import { devLog } from 'lib/common/devLog';
export default class MypageSellerClaimStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable
  sellerClaimList = {};

  @action
  getSellerClaimList = ({ size = 5, pageNo = 1 }) => {
    const job = () => {
      this.resetSellerClaimList();

      userSellerClaimService
        .getSellerClaims({
          userId: this.root.user.userId,
          pageNo,
          size,
        })
        .then(({ data }) => {
          this.sellerClaimList = data?.data || [];

          devLog(`data.data`, data.data);
        })
        .catch(() => {
          this.resetSellerClaimList();
        });
    };

    this.root.user.pushJobForUserInfo(job);
  };

  @action
  resetSellerClaimList = () => {
    this.sellerClaimList = [];
  };
}

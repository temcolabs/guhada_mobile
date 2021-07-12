import { observable, action, computed } from 'mobx';
import _ from 'lodash';

import API from 'lib/API';

import blockchainWalletService from 'lib/API/blockchain/blockchainWalletService';
import { devLog } from 'lib/common/devLog';
import { isBrowser } from 'lib/common/isServer';
/**
 * 내 사이즈 관리
 */
export default class MypageTokenStore {
  constructor(root) {
    if (isBrowser) {
      this.root = root;
    }
  }

  @observable isAddressModal = false;

  @action
  isAddressModalOpen = ({ tokenName }) => {
    this.getTokenAddress({ tokenName: tokenName });
  };

  @action
  isAddressModalClose = () => {
    this.isAddressModal = false;
  };

  @observable tokenList;
  getTokenList = async () => {
    try {
      const { data } = await blockchainWalletService.getTokenList();
      devLog('getTokenList', data?.data);
      this.tokenList = data?.data;
    } catch (e) {
      console.error(e);
    }
  };
  @observable page = 1;
  @observable unitPerPage = 10;
  @observable tokenHistory;

  @action
  setPage = (page) => {
    this.page = page;
  };

  getTokenHistory = async ({ tokenName }) => {
    try {
      const { data } = await blockchainWalletService.getTokenHistory({
        tokenName,
        page: this.page,
        unitPerPage: this.unitPerPage,
      });
      devLog('getTokenHistory', data?.data);
      this.tokenHistory = data?.data;
    } catch (e) {
      console.error(e);
    }
  };

  @observable tokenAddress;
  getTokenAddress = async ({ tokenName }) => {
    try {
      const { data } = await blockchainWalletService.getTokenAddress({
        tokenName,
      });
      devLog('getTokenAddress', data?.data);
      this.tokenAddress = data?.data;
      this.isAddressModal = true;
    } catch (e) {
      console.error(e);
    }
  };
}

import API from 'lib/API';

/**
 * 블록체인 지갑
 * http://dev.blockchain.guhada.com/swagger-ui.html#/block-chain-wallet-controller
 */
export default {
  /**
   * 구하다의 전체 토큰 리스트와 현재 로그인한 사용자의 토큰 보유량을 보여줍니다.
   * http://dev.blockchain.guhada.com/swagger-ui.html#/block-chain-wallet-controller/getTokenListUsingGET
   */
  getTokenList: () => {
    return API.blockchain.get(`/blockchain-wallet/token-list`);
  },

  /**
   * 토큰 리스트에서 가져온 tokenName 값을 주시면 해당하는 토큰을 입금할 수 있는 입금 주소와 토큰에 관련된 정보들을 보여줍니다.
   * http://dev.blockchain.guhada.com/swagger-ui.html#/block-chain-wallet-controller/getTokenAddressUsingGET
   */
  getTokenAddress: ({ tokenName }) => {
    return API.blockchain.get(
      `/blockchain-wallet/token-address?tokenName=${tokenName}`
    );
  },

  /**
   * 토큰 리스트에서 가져온 tokenName 값을 주시면 해당하는 토큰의 입금 및 변환 히스토리를 내려줍니다.
   * http://dev.blockchain.guhada.com/swagger-ui.html#/block-chain-wallet-controller/getMyTokenHistoryUsingGET
   */
  getTokenHistory: ({ tokenName, page, unitPerPage }) => {
    return API.blockchain.get(
      `/blockchain-wallet/my-token-history?tokenName=${tokenName}&page=${page}&unitPerPage=${unitPerPage}`
    );
  },
};

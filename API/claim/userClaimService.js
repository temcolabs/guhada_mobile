import API from 'childs/lib/API';

export default {
  /**
   * 판매자 문의하기 type 가져오기
   * returns Promise<{ name: string, description: string }[]>
   */
  getSellerClaimTypes: () => {
    return API.claim.get(`/users/seller-claims/types`);
  },

  /**
   * 판매자 문의하기 등록
   */
  createSellerClaim: ({
    userId,
    body = {
      contents: 'string',
      imageUrls: [],
      orderProdGroupId: 0,
      sellerId: 0,
      title: 'string',
      type: {
        description: 'string',
        name: 'string',
      },
    },
  }) => {
    return API.claim.post(`/users/${userId}/seller-claims`, body);
  },

  /**
   * 유저 문의하기 type 가져오기
   * 카테고리 코드에 children이 있는 구조
    {
      "code": "01",
      "description": "회원정보",
      "children": [
        {
          "code": "01001",
          "description": "회원가입/정보관리",
          "children": null
        },
        {
          "code": "01002",
          "description": "구하다 아이디/비밀번호",
          "children": null
        },
        {
          "code": "01003",
          "description": "탈퇴/재가입",
          "children": null
        }
      ]
    },
    ...
   */
  getUserClaimTypes: async () => {
    const { data } = await API.claim.get(`/users/claims/types`);
    return data.data;
  },

  /**
   * 유저 문의하기 등록
   */
  createUserClaim: ({
    userId,
    body = {
      title: '',
      content: '',
      imageUrls: [],
      typeCode: null, // 클레임 타입 데이터에서 code
    },
  }) => {
    return API.claim.post(`/users/${userId}/claims`, body);
  },
};

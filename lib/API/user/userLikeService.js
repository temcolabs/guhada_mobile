import API from 'lib/API';

export const bbsTargetTypes = {
  BBS: 'BBS',
  COMMENT: 'COMMENT',
};

export default {
  /**
   * 좋아요 저장.
   *
   * @param userId  회원 아이디
   * @param target  BBS, COMMENT
   */
  saveUserLike: ({ userId, target, targetId }) => {
    if (!userId || !target) {
      throw new Error(`[saveUserLike] invalid params`);
    } else {
      return API.user.post(`/users/${userId}/likes`, {
        target,
        targetId,
      });
    }
  },

  /**
   * 좋아요 제거
   *
   * @param userId  회원 아이디
   * @param target  삭제 대상, bbsTargetTypes
   * @param targetId  좋아요 항목 아이디
   */
  deleteUserLike: ({ userId, target, targetId }) => {
    return API.user.delete(`/users/${userId}/likes`, {
      params: {
        target,
        targetId,
      },
    });
  },
};

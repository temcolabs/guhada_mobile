import API from 'lib/API';

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
   * ? @param id  좋아요 항목 아이디. 코멘트나 게시글의 아이디?
   */
  deleteUserLike: ({ target, targetId }) => {
    // TODO: 좋아요 삭제 API 변경 확인
    // return API.user.delete(`/users/${userId}/likes/${id}`);
  },
};

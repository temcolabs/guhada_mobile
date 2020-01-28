import CommentStore from './CommentsStore';

describe('CommentStore', () => {
  describe('getCreatedTimeWithFormat', () => {
    // observable 사용하지 않으므로 1번만 초기화해도 됨
    const comment = new CommentStore({});

    it('1분 이내 작성한 글이라면 "조금 전" 표시', () => {
      const current = +new Date('2019-08-15 10:00:00');
      const created = +new Date('2019-08-15 10:00:20');

      const result = comment.getCreatedTimeWithFormat({
        current: current,
        created: created,
      });

      expect(result).toEqual(`조금 전`);
    });

    it('1시간 이내 작성한 글은 n분 전', () => {
      const current = +new Date('2019-08-15 10:02:00');
      const created = +new Date('2019-08-15 10:00:00');

      const result = comment.getCreatedTimeWithFormat({
        current: current,
        created: created,
      });

      expect(/^\d{1,2}분 전$/.test(result)).toEqual(true);
    });

    it('24시간 이내 작성한 글은 n시간 전', () => {
      const current = +new Date('2019-08-15 13:20:00');
      const created = +new Date('2019-08-15 10:00:00');

      const result = comment.getCreatedTimeWithFormat({
        current: current,
        created: created,
      });

      expect(/^\d{1,2}시간 전$/.test(result)).toEqual(true);
    });

    it('24시간 이상 전, 올해 안에 작성한 글은 M월 D일', () => {
      const current = +new Date('2019-08-15 13:20:00');
      const created = +new Date('2019-02-21 10:00:00');

      const result = comment.getCreatedTimeWithFormat({
        current: current,
        created: created,
      });

      expect(/^\d{1,2}월 \d{1,2}일$/.test(result)).toEqual(true);
    });

    it('24시간 이상 전, 올해 전에 작성한 글은 YYYY년 M월 D일', () => {
      const current = +new Date('2019-08-15 13:20:00');
      const created = +new Date('2014-12-22 10:00:00');

      const result = comment.getCreatedTimeWithFormat({
        current: current,
        created: created,
      });

      expect(/^\d{4}년 \d{1,2}월 \d{1,2}일$/.test(result)).toEqual(true);
    });
  });
});

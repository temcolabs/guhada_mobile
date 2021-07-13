import { isBrowser } from 'lib/common/isServer';
import { pushRoute } from 'lib/router';
import { ALL_CATEGORY_ID } from 'components/community/list/useBBSSearchState';

function communityIndexPage() {
  if (isBrowser) {
    // 전체 게시판으로 리다이렉트
    pushRoute(`/community/board/${ALL_CATEGORY_ID}`);
  }

  return <div />;
}

export default communityIndexPage;

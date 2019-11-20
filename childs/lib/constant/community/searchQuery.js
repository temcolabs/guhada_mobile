import searchOrder from './searchOrder';
import searchType from './searchType';

export const ITEMS_PER_PAGE = 20; // 페이지당 보여줄 글 수
export const MAX_ITEMS_PER_PAGE = 120;
export const DEFAULT_ORDER = searchOrder.DATE_DESC;
export const DEFAULT_SEARCH_TYPE = searchType.TITLE_CONTENTS;

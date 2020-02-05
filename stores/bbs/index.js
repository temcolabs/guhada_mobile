import useStores from 'stores/useStores';
import ArticleStore from './ArticleStore';
import CommentsStore from './CommentsStore';
import CategoryStore from './CategoryStore';
import BBSSearchStore from './BBSSearchStore';
import MyBBSStore from './MyBBSStore';
import CategoryFilterStore from './CategoryFilterStore';
import TempArticleStore from './TempArticleStore';
import { useObserver } from 'mobx-react-lite';

/**
 * 커뮤니티 관련 스토어.
 * store 안에 store 인스턴스를 가지고 있는 구조.
 */
export default class BBSStore {
  constructor(root, initialData = {}) {
    this.search = new BBSSearchStore(root, initialData);
    this.article = new ArticleStore(root, initialData);
    this.comments = new CommentsStore(root, initialData);
    this.category = new CategoryStore(root, initialData);
    this.categoryFilter = new CategoryFilterStore(root, initialData);
    this.myBBS = new MyBBSStore(root, initialData);
    this.tempArticle = new TempArticleStore(root, initialData);
  }
}

/**
 * hook 컴포넌트에서 store인스턴스를 가져오기 위한 헬퍼 함수
 */
export const useBBSStore = () => {
  const bbs = useStores()?.bbs;

  console.log(bbs, 'bbs');
  return useObserver(() => ({
    search: bbs.search,
    article: bbs.article,
    comments: bbs.comments,
    category: bbs.category,
    categoryFilter: bbs.categoryFilter,
    myBBS: bbs.myBBS,
    tempArticle: bbs.tempArticle,
  }));
};

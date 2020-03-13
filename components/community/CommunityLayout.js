import React from 'react';
import css from './CommunityLayout.module.scss';
// import Breadcumb from 'components/common/Breadcumb';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import CommunitySidebar from './sidebar/CommunitySidebar';
import { inject, observer } from 'mobx-react';
import BoardMenus from 'components/community/sidebar/BoardMenus';
import { pushRoute } from 'childs/lib/router';
import { devWarn } from 'childs/lib/common/devLog';
import Footer from 'components/footer/Footer';
@withRouter
@inject(store => ({
  category: store.bbs.category,
}))
@observer
class CommunityLayout extends React.Component {
  componentDidMount() {
    // 게시판 카테고리(메뉴) 데이터를 가져온다.
    this.props.category.getCommunities();
  }
  handleClickWrite = () => {
    if (this.props.router.asPath.indexOf('/community/editor') < 0) {
      pushRoute(`/community/editor`, {
        query: {
          categoryId: this.props.router.query.categoryId,
        },
      });
    } else {
      devWarn('글쓰기 페이지에서는 동작하지 않음');
    }
  };

  render() {
    return (
      <DefaultLayout pageTitle={`커뮤니티`} kakaoChat={false} toolBar={true}>
        <div className={css.communityMain}>
          <BoardMenus />
          <div className={css.pageAndSidebar}>
            <div className={css.pageContents}>{this.props.children}</div>
          </div>

          <button className={css.writeButton} onClick={this.handleClickWrite}>
            글쓰기
          </button>
        </div>
        <Footer />
      </DefaultLayout>
    );
  }
}

export default CommunityLayout;

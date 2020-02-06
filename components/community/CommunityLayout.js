import React from 'react';
import css from './CommunityLayout.module.scss';
// import Breadcumb from 'components/common/Breadcumb';
import { withRouter } from 'next/router';
import DefaultLayout from 'components/layout/DefaultLayout';
import CommunitySidebar from './sidebar/CommunitySidebar';
import { inject, observer } from 'mobx-react';

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

  render() {
    return (
      <DefaultLayout pageTitle={`커뮤니티`}>
        <div className={css.communityMain}>
          <div className={css.pageAndSidebar}>
            <div className={css.pageContents}>{this.props.children}</div>
            <div className={css.sidebar}>
              <CommunitySidebar />
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }
}

export default CommunityLayout;

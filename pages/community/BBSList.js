import React, { Component } from 'react';
import BBSList from 'template/community/BBSList';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

/**
 * 게시판 글 리스트
 */
class BBSListPage extends Component {
  static async getInitialProps(ctx) {
    return {};
  }

  render() {
    return (
      <div>
        <HeadForSEO pageName="커뮤니티"></HeadForSEO>
        <BBSList />
      </div>
    );
  }
}

export default BBSListPage;

import { Component } from 'react';
import BBSList from 'template/community/BBSList';
import HeadForSEO from 'components/head/HeadForSEO';

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
        <HeadForSEO pageName="커뮤니티" />
        <BBSList />
      </div>
    );
  }
}

export default BBSListPage;

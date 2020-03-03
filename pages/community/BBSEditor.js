import React, { Component } from 'react';
import BBSEditor from 'template/community/BBSEditor';
import withAuth from 'components/common/hoc/withAuth';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

class BBSEditorPage extends Component {
  static async getInitialProps(ctx) {
    return {};
  }

  render() {
    return (
      <div>
        <HeadForSEO pageName="커뮤니티" />

        <BBSEditor />
      </div>
    );
  }
}

export default withAuth({ isAuthRequired: true })(BBSEditorPage);

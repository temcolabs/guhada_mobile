import React from 'react';
import { devLog } from 'lib/devLog';

/**
 * NICE 휴대폰 본인인증 후 오픈된 윈도우를 컨트롤하기 위한 페이지
 */
class niceAuthSuccess extends React.Component {
  static async getInitialProps(req) {
    return {
      query: req.query, // 결과가 리퀘스트 쿼리에 담겨 있음
    };
  }

  componentDidMount() {
    if (window.opener) {
      devLog(`[niceAuthSuccess] this.props.query`, this.props.query);
      window.opener.postMessage(this.props.query, '*');
    }
  }

  render() {
    return <div />;
  }
}

export default niceAuthSuccess;

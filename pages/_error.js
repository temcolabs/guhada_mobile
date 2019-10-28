import React from 'react';
import { pushRoute } from 'lib/router';
import qs from 'qs';
import { observer, inject } from 'mobx-react';

@inject('alert')
@observer
class ErrorPage extends React.Component {
  static async getInitialProps({ req, res, store }) {
    return {};
  }

  componentDidMount() {
    if (typeof window === 'object') {
      const query = qs.parse(window.location.search.substring(1));

      /**
       * 데스크탑에서 모바일로 돌렸다는 시그널이 있을 알림 표시.
       * 구하다 웹 데스크탑 프로젝트의 _document.js 파일 참조.
       */
      if (query.fromDesktop) {
        this.props.alert.showAlert({
          content: () => (
            <p>
              페이지를 찾을 수 없습니다. <br /> 데스크탑에서 확인해주세요.
            </p>
          ),
          onConfirm: () => {
            pushRoute('/');
          },
        });
      } else {
        pushRoute('/');
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div />;
  }
}

export default ErrorPage;

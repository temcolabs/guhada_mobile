import React from 'react';
import DefaultLayout from 'components/layout/DefaultLayout';
import { pushRoute, LinkRoute } from 'lib/router';
import { withRouter } from 'next/router';

@withRouter
class Home extends React.Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // FIXME: 라우팅 테스트를 위한 버튼. 삭제해도 상관없음.
    console.log(`[Home] this.props.router.query`, this.props.router.query);

    return (
      <DefaultLayout title={null}>
        <h1>home</h1>
        <div>
          <div>
            <button onClick={() => pushRoute('/?test=query&string=custom')}>
              /?test=query&string=custom
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/unique?page=1&sort=ASC')}>
              /unique?page=1&sort=ASC
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/unique?page=2&sort=DESC')}>
              /unique?page=2&sort=DESC
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/pk?page=3&sort=DESC')}>
              /pk?page=3&sort=DESC
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/login/login')}>
              /login/login
            </button>
          </div>

          <LinkRoute href={`/linkroutetest?page=10&sort=DONTKNOW`}>
            /linkroutetest?page=10&sort=DONTKNOW
          </LinkRoute>
        </div>
      </DefaultLayout>
    );
  }
}

export default Home;

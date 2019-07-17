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
      <DefaultLayout title={null} paddingTop={40}>
        <h1>home</h1>
        <div>
          <div>
            <button
              onClick={() =>
                pushRoute('/', {
                  query: { test: 'testvalue', string: 'custom string' },
                })
              }
            >
              /?test=query&string=custom
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/?page=1&sort=ASC')}>
              /?page=1&sort=ASC
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/?page=2&sort=DESC')}>
              /?page=2&sort=DESC
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/?page=3&sort=DESC')}>
              /?page=3&sort=DESC
            </button>
          </div>
          <div>
            <button onClick={() => pushRoute('/login?testquery=testquery')}>
              /login?testquery=testquery
            </button>
          </div>

          <LinkRoute href={`/login?page=10&sort=DONTKNOW`}>
            /login?page=10&sort=DONTKNOW
          </LinkRoute>
        </div>
      </DefaultLayout>
    );
  }
}

export default Home;

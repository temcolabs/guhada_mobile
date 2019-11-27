import React from 'react';
import { observer } from 'mobx-react';
import Login from 'template/signin/Login';
import Form from '../../stores/form-store/_.forms';
import withAuth from 'components/common/hoc/withAuth';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@withAuth({ isAuthRequired: false })
@observer
class index extends React.Component {
  componentDidMount() {}

  render() {
    Form.signIn.clear();

    return (
      <>
        <HeadForSEO pageName="로그인" />

        <div>
          <Login form={Form.signIn} />
        </div>
      </>
    );
  }
}

export default withAuth({ isAuthRequired: false })(index);

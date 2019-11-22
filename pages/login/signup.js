import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Form from '../../stores/form-store/_.forms';
import Signup from 'template/signin/Signup';
import HeadForSEO from 'childs/lib/components/HeadForSEO';

@observer
class signup extends Component {
  render() {
    Form.signUp.clear();
    Form.termAgree.clear();
    return (
      <>
        <HeadForSEO pageName="회원가입" />
        <div>
          <Signup form={Form.signUp} termAgree={Form.termAgree} />
        </div>
      </>
    );
  }
}

export default signup;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Form from '../../stores/form-store/_.forms';
import FindPassword from 'template/signin/FindPassword';
import HeadForSEO from 'lib/components/HeadForSEO';

@observer
class findpassword extends Component {
  render() {
    Form.findPasswordMobile.clear();
    Form.findPasswordEmail.clear();

    return (
      <>
        <HeadForSEO pageName="패스워드 찾기" />
        <div>
          <FindPassword
            formMobile={Form.findPasswordMobile}
            formEmail={Form.findPasswordEmail}
          />
        </div>
      </>
    );
  }
}

export default findpassword;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Form from '../../stores/form-store/_.forms';
import FindId from 'template/signin/FindId';
import HeadForSEO from 'lib/components/HeadForSEO';

@observer
class findid extends Component {
  render() {
    Form.idFind.clear();
    return (
      <>
        <HeadForSEO pageName="아이디 찾기" />

        <div>
          <FindId form={Form.idFind} />
        </div>
      </>
    );
  }
}

export default findid;

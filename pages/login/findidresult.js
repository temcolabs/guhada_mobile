import { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Form from 'stores/form-store/_.forms';
import FindIdResult from 'template/signin/FindIdResult';
import { pushRoute } from 'lib/router';
import HeadForSEO from 'components/head/HeadForSEO';

@inject('authmobile')
@observer
class findidresult extends Component {
  componentDidMount() {
    let { authmobile } = this.props;
    if (authmobile.verifyParams.diCode !== '') {
    } else if (Form.idFind.values().mobile !== '') {
    } else {
      pushRoute('/login/findid');
    }
  }
  render() {
    let formValue;
    let { authmobile } = this.props;
    if (authmobile.verifyParams.diCode !== '') {
      formValue = authmobile.verifyParams;
    } else if (Form.idFind.values().mobile !== '') {
      formValue = Form.idFind;
    }
    return (
      <>
        <HeadForSEO pageName="아이디 찾기 결과" />

        <div>
          <FindIdResult form={Form.idFind} formValue={formValue} />
        </div>
      </>
    );
  }
}

export default findidresult;

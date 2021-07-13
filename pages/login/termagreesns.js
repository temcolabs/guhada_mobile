import { Component } from 'react';
import Term from 'components/login/Term';
import Form from 'stores/form-store/_.forms';
import HeadForSEO from 'components/head/HeadForSEO';

export class termagreesns extends Component {
  render() {
    Form.termAgree.clear();
    Form.termAgree.$('sns').set('value', true);

    return (
      <>
        <HeadForSEO pageName="약관동의" />
        <div>
          <Term form={Form.termAgree} />
        </div>
      </>
    );
  }
}

export default termagreesns;

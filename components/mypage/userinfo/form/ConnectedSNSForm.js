import React from 'react';
import css from './UserEditForm.module.scss';
import { useObserver, observer } from 'mobx-react-lite';
import Checkbox from 'components/mypage/form/Checkbox';
import useStores from 'stores/useStores';
import cn from 'classnames';

function ConnectedSNSForm() {
  const { user: userStore } = useStores();
  const { connectedSNS } = userStore;

  return (
    <div className={cn(css.formGroup, css.connectedSnsWrap)}>
      <div className={css.formInput}>
        <Checkbox
          icon="naver"
          name="accountNaver"
          initialValue={connectedSNS.NAVER}
          fixed
        >
          네이버
        </Checkbox>
      </div>
      <div className={css.formInput}>
        <Checkbox
          icon="kakao"
          name="accountKakao"
          initialValue={connectedSNS.KAKAO}
          fixed
        >
          카카오톡
        </Checkbox>
      </div>
      <div className={css.formInput}>
        <Checkbox
          icon="facebook"
          name="accountFacebook"
          initialValue={connectedSNS.FACEBOOK}
          fixed
        >
          페이스북
        </Checkbox>
      </div>
      <div className={css.formInput}>
        <Checkbox
          icon="google"
          name="accountGoogle"
          initialValue={connectedSNS.GOOGLE}
          fixed
        >
          구글
        </Checkbox>
      </div>
    </div>
  );
}
export default observer(ConnectedSNSForm);

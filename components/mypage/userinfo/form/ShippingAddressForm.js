import React, { useContext } from 'react';
import css from './UserEditForm.module.scss';
import cn from 'classnames';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react-lite';
import Text from 'components/mypage/form/Text';
import { pushRoute } from 'childs/lib/router';

export default function ShippingAddressForm() {
  const { alert: alertStore } = useStores();
  const { formApi } = useContext(UserEditFormContext);

  const handleClickLink = () => {
    // 필드 데이터가 초기값과 같다면
    if (formApi.getState().pristine) {
      pushRoute('/mypage/address');
    } else {
      alertStore.showConfirm({
        content: () => (
          <div>
            변경 사항이 있습니다.
            <br />
            저장하지 않고 이동하시겠습니까?
          </div>
        ),
        onConfirm: () => {
          pushRoute('/mypage/address');
        },
      });
    }
  };

  return useObserver(() => (
    <div>
      <Text>
        배송지 정보는{' '}
        <a
          className={cn(css.highlight, css.link)}
          // onClick={handleClickLink}
        >
          배송지 관리
        </a>
        에서 수정 및 등록 가능합니다.
      </Text>
    </div>
  ));
}

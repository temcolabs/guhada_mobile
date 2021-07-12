import React, { useCallback } from 'react';
import css from './UserEditForm.module.scss';
import FormButton from 'components/mypage/form/FormButton';
import useStores from 'stores/useStores';
import userService from 'lib/API/user/userService';
import { pushRoute } from 'lib/router';

/**
 * 회원탈퇴 버튼
 */
export default function WithdrawalForm() {
  const { alert: alertStore, login: loginStore } = useStores();

  const handleClickWithdraw = useCallback(() => {
    alertStore.showConfirm({
      content: '정말로 탈퇴하시겠습니까?',
      onConfirm: async () => {
        try {
          // TODO: 회원탈퇴 API 호출
          await userService.withdraw();
          loginStore.logout();
          alertStore.showAlert('회원 탈퇴 처리가 완료되었습니다.');
          pushRoute('/');
        } catch (e) {
          console.error(e);
        }
      },
    });
  }, [alertStore, loginStore]);

  return (
    <div className={css.formGroup}>
      <div
        className={css.formInput}
        style={{ width: '100%', padding: '0 20px', marginTop: '15px' }}
      >
        <FormButton
          style={{
            width: '100%',
            height: '40px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#dbdbdb',
            borderRadius: '0',
            borderColor: '#eeeeee',
          }}
          onClick={handleClickWithdraw}
        >
          회원 탈퇴
        </FormButton>
      </div>
    </div>
  );
}

import React from 'react';
import ModalPortal from 'components/templates/ModalPortal';
import css from './HeaderMenu.module.scss';
import Category from './item/Category';
import { LinkRoute } from 'childs/lib/router';
import Router from 'next/router';
import { inject } from 'mobx-react';
import { loginStatus } from 'childs/lib/constant';

/**
 * 헤더의 햄버거 버튼 클릭시 표시되는 메뉴
 */
function HeaderMenu({
  onClose,
  setIsCategoryVisible = () => {},
  setCategoryId = () => {},
  setCategoryTitle = () => {},
  login,
  setIsBrandVisible = () => {},
}) {
  return (
    <ModalPortal handleClose={onClose} slide={2}>
      <div className={css.wrapper}>
        <div className={css.topWrap}>
          {login.loginStatus === loginStatus.LOGIN_DONE && login.userInfo ? (
            <a
              className={css.login}
              onClick={() => {
                login.logout();
                onClose();
              }}
            >
              로그아웃
            </a>
          ) : (
            <a className={css.login} onClick={() => Router.push('/login')}>
              로그인 해주세요
            </a>
          )}

          {/* </LinkRoute> */}
          <div className={css.itemWrap}>
            <LinkRoute href={`/`}>
              <a>
                <div className={css.home} onClick={() => onClose()} />
              </a>
            </LinkRoute>
            {/* <LinkRoute href={`/`}>
              <a>
                <div className={css.setting} />
              </a>
            </LinkRoute> */}
            <a>
              <div className={css.close} onClick={onClose} />
            </a>
          </div>
        </div>
        <Category
          setIsCategoryVisible={setIsCategoryVisible}
          setCategoryId={setCategoryId}
          setCategoryTitle={setCategoryTitle}
          setIsBrandVisible={setIsBrandVisible}
          onClose={onClose}
        />

        {/* <div className={css.event}>event 영역</div>
        <div className={css.categoryWrap}>category 영역</div> */}
      </div>
    </ModalPortal>
  );
}
export default inject('login')(HeaderMenu);

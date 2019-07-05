import React from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './HeaderMenu.module.scss';
import Category from './item/Category';
import { LinkRoute } from 'lib/router';
/**
 * 헤더의 햄버거 버튼 클릭시 표시되는 메뉴
 */
export default function HeaderMenu({
  isVisible,
  onClose,
  setIsCategoryVisible,
  setCategoryId,
}) {
  return (
    <SlideIn isVisible={isVisible} direction={slideDirection.LEFT}>
      <div className={css.wrapper}>
        <div className={css.topWrap}>
          <LinkRoute href={`/login`}>
            <a className={css.login}>로그인 해주세요</a>
          </LinkRoute>
          <div className={css.itemWrap}>
            <LinkRoute href={`/`}>
              <a>
                <div className={css.home}></div>
              </a>
            </LinkRoute>
            <LinkRoute href={`/`}>
              <a>
                <div className={css.setting}></div>
              </a>
            </LinkRoute>
            <a>
              <div className={css.close} onClick={onClose}></div>
            </a>
          </div>
        </div>
        <Category
          setIsCategoryVisible={setIsCategoryVisible}
          setCategoryId={setCategoryId}
        />
      </div>
    </SlideIn>
  );
}

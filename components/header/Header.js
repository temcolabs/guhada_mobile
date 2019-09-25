import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import css from './Header.module.scss';
import HeaderMenu from './HeaderMenu';
import CategoryDepthMenu from './CategoryDepthMenu';
import { inject } from 'mobx-react';
import sessionStorage from 'lib/sessionStorage';
import { pushRoute } from 'lib/router';
import cn from 'classnames';
import SearchMenu from './SearchMenu';

/**
 *
 * @param {string} headerShape
 * productDetail 일때 layout 변경
 */
function Header({ children, headerShape, history }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  let urlHistory = sessionStorage.get('urlHistory');

  return (
    <>
      {headerShape === 'keyword' ? (
        <div className={css.wrap} />
      ) : (
        <div className={css.wrap}>
          {headerShape === 'productDetail' ||
          headerShape === 'searchList' ||
          (headerShape === 'address' && urlHistory !== '') ? (
            <button
              className={css.backButton}
              onClick={() => window.history.back()}
            />
          ) : null}
          <button
            className={css.menuButton}
            onClick={() => setIsMenuVisible(true)}
          />

          {/* 페이지 타이틀 또는 로고 렌더링 */}
          {children ? (
            <div className={css.pageTitle}>{children}</div>
          ) : (
            <Link href="/">
              <div className={css.headerLogo} />
            </Link>
          )}

          {headerShape === 'productDetail' ? (
            <Link href="/">
              <button className={css.homeButton} />
            </Link>
          ) : null}
          <button
            className={cn(css.searchButton, {
              [css.leftItemExist]: headerShape === 'productDetail',
            })}
            onClick={() => setIsSearchVisible(true)}
          />
          <Link href="/shoppingcart">
            <button className={css.cartButton} />
          </Link>
          <HeaderMenu
            isVisible={isMenuVisible}
            onClose={() => setIsMenuVisible(false)}
            setIsCategoryVisible={setIsCategoryVisible}
            setCategoryId={setCategoryId}
            setCategoryTitle={setCategoryTitle}
          />

          <CategoryDepthMenu
            isVisible={isCategoryVisible}
            onBack={() => setIsCategoryVisible(false)}
            onClose={() => (
              setIsMenuVisible(false),
              setTimeout(() => {
                setIsCategoryVisible(false);
              }, 400)
            )}
            categoryId={categoryId}
            categoryTitle={categoryTitle}
          />

          <SearchMenu
            isVisible={isSearchVisible}
            onClose={() => setIsSearchVisible(false)}
          />
        </div>
      )}
    </>
  );
}
export default inject('history')(Header);

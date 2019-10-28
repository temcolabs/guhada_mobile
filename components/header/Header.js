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
import BrandContainer from './item/BrandContainer';
// import { observer } from 'mobx-react-lite';
import { devLog } from 'lib/devLog';
// import useStores from 'stores/useStores';
import _ from 'lodash';
/**
 *
 * @param {string} headerShape
 * productDetail 일때 layout 변경
 */
function Header({ children, headerShape, history, cartAmount }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isBrandVisible, setIsBrandVisible] = useState(false);
  let urlHistory = sessionStorage.get('urlHistory');

  return (
    <>
      {headerShape === 'keyword' ? (
        <div className={css.wrap} />
      ) : (
        // 헤더의 보더
        <div
          className={cn(css.wrap, {
            [css.borderBottom]:
              headerShape === 'sellerStore' ||
              headerShape === 'productDetail' ||
              headerShape === 'ordersuccess' ||
              headerShape === 'orderpayment' ||
              headerShape === 'shoppingcart' ||
              headerShape === 'brand',
          })}
        >
          {/* 백버튼 */}
          {headerShape === 'productDetail' ||
          headerShape === 'searchList' ||
          headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'sellerStore' ||
          headerShape === 'brand' ||
          (headerShape === 'address' && urlHistory !== '') ? (
            <button className={css.backButton} onClick={() => Router.back()} />
          ) : null}

          {headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'ordersuccess' ? null : (
            <button
              className={css.menuButton}
              onClick={() => setIsMenuVisible(true)}
            />
          )}

          {/* 페이지 타이틀 또는 로고 렌더링 */}
          {children ? (
            <div className={css.pageTitle}>{children}</div>
          ) : headerShape === 'productDetail' ? null : (
            <Link href="/">
              <div className={css.headerLogo} />
            </Link>
          )}

          {headerShape === 'productDetail' ? (
            <Link href="/">
              <button className={css.homeButton} />
            </Link>
          ) : null}

          {headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'ordersuccess' ? null : (
            <button
              className={cn(css.searchButton, {
                [css.leftItemExist]: headerShape === 'productDetail',
              })}
              onClick={() => setIsSearchVisible(true)}
            />
          )}

          {headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'ordersuccess' ? null : (
            <Link href="/shoppingcart">
              <div className={css.cartButton}>
                <button />
                {cartAmount > 0 ? <div>{cartAmount}</div> : null}
              </div>
            </Link>
          )}
          {/* 닫기버튼 */}
          {headerShape === 'ordersuccess' ? (
            <Link href="/">
              <div className={css.closeButton} />
            </Link>
          ) : null}

          <HeaderMenu
            isVisible={isMenuVisible}
            onClose={() => setIsMenuVisible(false)}
            setIsCategoryVisible={setIsCategoryVisible}
            setCategoryId={setCategoryId}
            setCategoryTitle={setCategoryTitle}
            setIsBrandVisible={setIsBrandVisible}
          />

          <CategoryDepthMenu
            isVisible={isCategoryVisible}
            onBack={() => setIsCategoryVisible(false)}
            onClose={() => {
              setIsMenuVisible(false);
              setTimeout(() => {
                setIsCategoryVisible(false);
              }, 400);
            }}
            onCloseMenu={() => setIsMenuVisible(false)}
            categoryId={categoryId}
            categoryTitle={categoryTitle}
          />

          <BrandContainer
            isVisible={isBrandVisible}
            onClose={() => setIsBrandVisible(false)}
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

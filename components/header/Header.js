import React, { useState } from 'react';
import Link from 'next/link';
import css from './Header.module.scss';
import HeaderMenu from './HeaderMenu';
import CategoryDepthMenu from './CategoryDepthMenu';

export default function Header({ children }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(0);

  return (
    <>
      <div className={css.wrap}>
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

        <button className={css.searchButton} onClick={() => {}} />
        <button className={css.cartButton} onClick={() => {}} />

        <HeaderMenu
          isVisible={isMenuVisible}
          onClose={() => setIsMenuVisible(false)}
          setIsCategoryVisible={setIsCategoryVisible}
          setCategoryId={setCategoryId}
        />

        <CategoryDepthMenu
          isVisible={isCategoryVisible}
          onClose={() => setIsCategoryVisible(false)}
          categoryId={categoryId}
        />
      </div>
    </>
  );
}

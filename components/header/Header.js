import React, { useState } from 'react';
import Link from 'next/link';
import css from './Header.module.scss';
import HeaderMenu from './HeaderMenu';

export default function Header({ children }) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

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
      </div>
      {isMenuVisible && <HeaderMenu onClose={() => setIsMenuVisible(false)} />}
    </>
  );
}

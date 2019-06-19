import React, { useState } from 'react';
import Link from 'next/link';
import css from './Header.module.scss';
import HeaderMenu from './HeaderMenu';

export default function Header() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  return (
    <>
      <div className={css.wrap}>
        <button
          className={css.menuButton}
          onClick={() => setIsMenuVisible(true)}
        ></button>
        <Link href="/">
          <div className={css.headerLogo} />
        </Link>
        <button className={css.searchButton} onClick={() => {}}></button>
        <button className={css.cartButton} onClick={() => {}}></button>
      </div>
      {isMenuVisible && (
        <HeaderMenu onClose={() => setIsMenuVisible(false)}></HeaderMenu>
      )}
    </>
  );
}

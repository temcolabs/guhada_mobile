import { useState, memo } from 'react';
import Router from 'next/router';
import css from './Header.module.scss';
import HeaderMenu from './HeaderMenu';
import CategoryDepthMenu from './CategoryDepthMenu';
import sessionStorage from 'childs/lib/common/sessionStorage';
import { LinkRoute } from 'childs/lib/router';
import cn from 'classnames';
import SearchMenu from './SearchMenu';
import BrandContainer from './item/BrandContainer';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react-lite';

/**
 *
 * @param {string} headerShape
 * productDetail 일때 layout 변경
 */
function Header({
  children,
  pageTitle,
  headerShape,
  cartAmount,
  scrollDirection,
}) {
  // eslint-disable-next-line
  const { history } = useStores();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isBrandVisible, setIsBrandVisible] = useState(false);
  let urlHistory = sessionStorage.get('urlHistory');

  return useObserver(() => (
    <>
      {headerShape === 'keyword' ? (
        <div className={css.wrap} />
      ) : (
        // 헤더의 보더
        <div
          className={cn(
            css.wrap,
            {
              [css.borderBottom]:
                headerShape === 'detailPage' ||
                headerShape === 'sellerStore' ||
                headerShape === 'productDetail' ||
                headerShape === 'ordersuccess' ||
                headerShape === 'orderpayment' ||
                headerShape === 'shoppingcart' ||
                headerShape === 'brand' ||
                headerShape === 'review' ||
                headerShape === 'eventmain' ||
                headerShape === 'BBSArticleView',
            },
            { [css.scrollDown]: scrollDirection === 'down' }
          )}
          // style={scrollDirection === 'down' ? { display: 'none' } : null}
        >
          {/* 백버튼 */}
          {headerShape === 'detailPage' ||
          headerShape === 'productDetail' ||
          headerShape === 'searchList' ||
          headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'sellerStore' ||
          headerShape === 'brand' ||
          headerShape === 'eventmain' ||
          headerShape === 'BBSArticleView' ||
          headerShape === 'special' ||
          headerShape === 'review' ||
          (headerShape === 'address' && urlHistory !== '') ? (
            <button
              className={css.backButton}
              onClick={() =>
                headerShape === 'review'
                  ? Router.push('/review')
                  : Router.back()
              }
            />
          ) : null}

          {headerShape === 'detailPage' ||
          headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'ordersuccess' ||
          headerShape === 'review' ||
          headerShape === 'recently' ||
          headerShape === 'BBSArticleView' ? null : (
            <button
              className={css.menuButton}
              onClick={() => setIsMenuVisible(true)}
            />
          )}

          {/* 페이지 타이틀 또는 로고 렌더링 */}
          {children || pageTitle ? (
            <h1 className={css.pageTitle}>{children || pageTitle}</h1>
          ) : headerShape === 'productDetail' ||
            headerShape === 'recently' ? null : (
            <LinkRoute href="/">
              <div className={css.headerLogo} />
            </LinkRoute>
          )}

          {headerShape === 'productDetail' ? (
            <LinkRoute href="/">
              <button className={css.homeButton} />
            </LinkRoute>
          ) : null}

          {/* 검색 */}
          {headerShape === 'detailPage' ||
          headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'review' ||
          headerShape === 'ordersuccess' ||
          headerShape === 'recently' ? null : (
            <button
              className={cn(css.searchButton, {
                [css.leftItemExist]: headerShape === 'productDetail',
              })}
              onClick={() => setIsSearchVisible(true)}
            />
          )}

          {/* 장바구니 */}
          {headerShape === 'detailPage' ||
          headerShape === 'shoppingcart' ||
          headerShape === 'orderpayment' ||
          headerShape === 'review' ||
          headerShape === 'ordersuccess' ||
          headerShape === 'recently' ? null : (
            <LinkRoute href="/shoppingcart">
              <div className={css.cartButton}>
                <button />
                {cartAmount > 0 ? <div>{cartAmount}</div> : null}
              </div>
            </LinkRoute>
          )}

          {/* 닫기버튼 */}
          {headerShape === 'ordersuccess' || headerShape === 'recently' ? (
            <LinkRoute href="/">
              <div className={css.closeButton} />
            </LinkRoute>
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
            onCloseMenu={() => setIsMenuVisible(false)}
          />

          <SearchMenu
            isVisible={isSearchVisible}
            onClose={() => setIsSearchVisible(false)}
          />
        </div>
      )}
    </>
  ));
}
export default memo(Header);

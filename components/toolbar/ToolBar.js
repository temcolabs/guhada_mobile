import { useState, useCallback, useMemo } from 'react';
import css from './ToolBar.module.scss';
import cn from 'classnames';
import ToolbarCategory from './ToolbarCategory';
import ToolbarBrand from './ToolbarBrand';
import { useObserver } from 'mobx-react';
import { pushRoute } from 'lib/router';
import useStores from 'stores/useStores';

function ToolBar() {
  const { alert } = useStores();
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [isBrandVisible, setIsBrandVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState('');

  // const hostMypageEnabled = useMemo(
  //   () => [/^local\.?.+/, /^dev\..+/, /^qa\..+/, /^stg\..+/],
  //   []
  // );

  // const handleClickMypage = useCallback(() => {
  //   // FIXME: 마이페이지 개발 완료 후 조건문 제거
  //   const isMypageEnabled =
  //     hostMypageEnabled.findIndex(
  //       regex => regex.test(window.location.hostname) === true
  //     ) > -1;

  //   if (isMypageEnabled) {
  //     setSelectedTool('mypage');
  //     pushRoute('/mypage');
  //   } else {
  //     alert.showAlert({ content: '모바일 버전 준비중입니다.' });
  //   }
  // }, [alert, hostMypageEnabled]);

  return useObserver(() => (
    <div className={css.wrap}>
      <div
        onClick={() => {
          setIsCategoryVisible(true);
          setSelectedTool('category');
        }}
        className={cn(css.itemWrap, css.category, {
          [css.selected]: selectedTool === 'category',
        })}
      >
        카테고리
      </div>
      <div
        onClick={() => {
          setIsBrandVisible(true);
          setSelectedTool('brand');
        }}
        className={cn(css.itemWrap, css.brand, {
          [css.selected]: selectedTool === 'brand',
        })}
      >
        브랜드
      </div>
      <div
        onClick={() => {
          setSelectedTool('home');
          pushRoute('/?home=0');
        }}
        className={cn(css.itemWrap, css.home, {
          [css.selected]: selectedTool === 'home',
        })}
      >
        홈
      </div>
      <div
        onClick={() => {
          setSelectedTool('community');
          pushRoute('/community');
        }}
        className={cn(css.itemWrap, css.community, {
          [css.selected]: selectedTool === 'community',
        })}
      >
        커뮤니티
      </div>
      <div
        onClick={() => {
          setSelectedTool('mypage');
          pushRoute('/mypage');
        }}
        className={cn(css.itemWrap, css.mypage, {
          [css.selected]: selectedTool === 'mypage',
        })}
      >
        마이페이지
      </div>

      {/* 카테고리 슬라이드 업 모달 */}
      <ToolbarCategory
        isVisible={isCategoryVisible}
        onClose={() => setIsCategoryVisible(false)}
      />

      {/* 브랜드 슬라이드 업 모달 */}
      <ToolbarBrand
        isVisible={isBrandVisible}
        onClose={() => setIsBrandVisible(false)}
      />
    </div>
  ));
}
export default ToolBar;

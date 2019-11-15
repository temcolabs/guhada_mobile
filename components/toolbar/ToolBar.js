import React, { useState } from 'react';
import css from './ToolBar.module.scss';
import cn from 'classnames';
import ToolbarCategory from './ToolbarCategory';
import ToolbarBrand from './ToolbarBrand';
import Router from 'next/router';
import { inject } from 'mobx-react';
import LuckydrawLogin from 'template/event/LuckydrawLogin';
import LuckydrawSignup from 'template/event/LuckydrawSignup';
import LuckydrawModify from 'template/event/LuckydrawModify';
import { loginStatus } from 'constant/';
import { useObserver } from 'mobx-react-lite';

function ToolBar({ alert, luckyDraw, login }) {
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);
  const [isBrandVisible, setIsBrandVisible] = useState(false);
  const [selectedTool, setSelectedTool] = useState('');

  return useObserver(() => (
    <div className={css.wrap}>
      <div className={css.btnTop} onClick={() => window.scrollTo(0, 0)} />
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
          Router.push('/?home=0');
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
          alert.showAlert({ content: '모바일 버전 준비중입니다.' });
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
          alert.showAlert({ content: '모바일 버전 준비중입니다.' });
          // login.loginStatus === loginStatus.LOGIN_DONE
          //   ? luckyDraw.getEventUser()
          //   : luckyDraw.setLuckydrawLoginModal(true);
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
export default inject('alert', 'luckyDraw', 'login')(ToolBar);

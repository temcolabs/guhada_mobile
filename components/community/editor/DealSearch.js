import React, { useState } from 'react';
import SlideUpOptions from '../form/SlideUpOptions';
import css from './DealSearch.module.scss';
import TextInput from '../form/TextInput';
import addCommaToNum from 'childs/lib/common/addCommaToNum';

/**
 * 글쓰기 화면에서 게시판 선택
 */
const DealSearch = ({ onChangeDealName = () => {}, initialDealName = '' }) => {
  return (
    <>
      <SlideUpOptions
        renderButton={() => {
          return (
            <div className={css.wrap}>
              <TextInput
                placeholder="상품명을 입력해주세요"
                onChange={onChangeDealName}
                initialValue={initialDealName}
              />
            </div>
          );
        }}
        // TODO: 상품 검색. 마크업은 되어 있음. API 연결 필요
        // renderSlideArea={({ initialStyle, toggleSlide }) => {
        //   return (
        //     <div className={css.searchResult} style={initialStyle}>
        //       <div className={css.resultSection}>
        //         <div className={css.sectionTitle}>최근 구매한 상품</div>
        //         {[1, 1].map(() => {
        //           return (
        //             <div className={css.recentOrderItem}>
        //               <div className={css.recentOrderItem_image} />
        //               <div className={css.recentOrderItem_info}>
        //                 <div className={css.recentOrderItem_name}>
        //                   [GUCCI] 19FW 반소매 프린트 레이스 블라우스
        //                 </div>
        //                 <div className={css.recentOrderItem_option}>
        //                   <span>옵션</span>
        //                   <span>체리 85 1개</span>
        //                 </div>
        //                 <div className={css.recentOrderItem_price}>
        //                   {addCommaToNum(215000)}원
        //                 </div>
        //               </div>
        //             </div>
        //           );
        //         })}
        //       </div>
        //       <div className={css.resultSection}>
        //         <div className={css.sectionTitle}>검색한 상품</div>
        //         {[1, 2, 3].map(item => {
        //           return (
        //             <div className={css.searchedItem}>킹스네이크 프린트 </div>
        //           );
        //         })}
        //       </div>
        //     </div>
        //   );
        // }}
        topPosOnEnter="49px"
        topPosOnExit="49px"
      />
    </>
  );
};

export default DealSearch;

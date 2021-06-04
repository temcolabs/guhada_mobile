import React, { useState, useEffect } from 'react';
import { inject } from 'mobx-react';
import css from './SpecialList.module.scss';
import DefaultLayout from 'components/layout/DefaultLayout';
import CategorySlider from 'components/common/CategorySlider';
import ListItem from 'components/event/special/ListItem';
import Filter from 'components/event/special/Filter';
import { useObserver } from 'mobx-react-lite';
import useStores from 'stores/useStores';
import { useScrollDirection } from 'hooks';
import { mainCategory } from 'childs/lib/constant/category';

function SpecialList({ special }) {
  const {
    main: mainStore,
  } = useStores();
  const scrollDirection = useScrollDirection();

  return useObserver(() => (
    <DefaultLayout
      title={null}
      topLayout={'main'}
      scrollDirection={scrollDirection}
    >
      <CategorySlider
        categoryList={mainCategory.item}
        setNavDealId={mainStore.setNavDealId}
        scrollDirection={scrollDirection}
      />

      <div className={css.wrap}>
        <div className={css.dashBoard}>
          <div className={css.totalCount}>
            총 {special.specialList.length}개
          </div>
          <div className={css.filter}>
            <Filter
              onChange={(value) => {
                special.getSpecialList(value);
              }}
            />
          </div>
        </div>

        {special?.specialList?.length > 0 ? (
          <div className={css.specialListWrap}>
            {special?.specialList?.map((data, index) => {
              return <ListItem key={index} data={data} />;
            })}
          </div>
        ) : null}

        {/* TODO : 기획전 리스트를 보여주는 곳 은 아직 더보기 기능이 개발되지 않음 */}
        {true ? null : (
          <div className={css.moreButton}>
            더 보기
            <i />
          </div>
        )}
      </div>
    </DefaultLayout>
  ));
}

export default inject('special')(SpecialList);

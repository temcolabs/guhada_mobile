import { useMemo } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import useStores from 'stores/useStores';

import Image from 'components/atoms/Image';
import DefaultLayout from 'components/layout/DefaultLayout';

import { pushRoute } from 'childs/lib/router';
import { useScrollDirection, useWindowSize } from 'hooks';

import {
  RecentlyWrapper,
  MenuSection,
  MenuCounts,
  MenuDeleteButton,
  ContentSection,
  ContentItem,
  ContentDeleteButton,
  ContentEmpty,
  ContentEmptyCenter,
  ContentEmptyItem,
} from './Styled';

const IMAGE_PATH = {
  DELETE_IMAGE: '/static/icon/like_item_delete.png',
  NO_DATA: '/static/icon/icon_no_data.png',
};

function RecentlyTemplate() {
  const { mypageRecentlySeen } = useStores();
  const { width: windowWidth } = useWindowSize();
  const scrollDirecton = useScrollDirection();

  const histoyItems = toJS(mypageRecentlySeen.list);

  /**
   * handlers
   */

  // 최근 본 상품 > 아이템 삭제
  const onClickDeleteItem = (e, dealsId) =>
    mypageRecentlySeen.removeItem(e, dealsId);

  // 최근 본 상품 > 아이템 전체 삭제
  const onClickAllDeleteItem = () => mypageRecentlySeen.removeItemAll();

  // 최근 본 상품 > 아이템 상세 이동
  const onClickSelectItem = (dealId) =>
    pushRoute(`/productdetail?deals=${dealId}`);

  /**
   * Helpers
   */

  // 아이템 길이
  const ContentItemLength = useMemo(() => (windowWidth - 43) / 3, [
    windowWidth,
  ]);

  return (
    <DefaultLayout
      pageTitle={'최근 본 상품'}
      topLayout={'main'}
      headerShape={'recently'}
      kakaoChat={false}
      scrollDirection={scrollDirecton}
    >
      <RecentlyWrapper>
        {/* 상단 메뉴 */}
        <MenuSection>
          <MenuCounts>총 {histoyItems?.length}개</MenuCounts>
          <MenuDeleteButton onClick={() => onClickAllDeleteItem()}>
            전체 삭제
          </MenuDeleteButton>
        </MenuSection>
        {/* 최근 본 상품 */}
        {histoyItems && histoyItems.length ? (
          <ContentSection>
            {histoyItems.map((o) => (
              // 전체 - 40 / 3
              <ContentItem
                key={o.dealId}
                length={ContentItemLength}
                onClick={() => onClickSelectItem(o.dealId)}
              >
                <Image src={o.imageUrls[0]} size={'contain'} />
                <ContentDeleteButton
                  onClick={(e) => onClickDeleteItem(e, o.dealsId)}
                  length={ContentItemLength}
                >
                  <Image
                    src={IMAGE_PATH.DELETE_IMAGE}
                    width={'26px'}
                    height={'26px'}
                  />
                </ContentDeleteButton>
              </ContentItem>
            ))}
          </ContentSection>
        ) : (
          <ContentEmpty>
            <ContentEmptyCenter>
              <ContentEmptyItem>
                <Image
                  isLazy={true}
                  src={IMAGE_PATH.NO_DATA}
                  width={'60px'}
                  height={'60px'}
                />
              </ContentEmptyItem>
              <ContentEmptyItem>최근 본 상품이 없습니다.</ContentEmptyItem>
            </ContentEmptyCenter>
          </ContentEmpty>
        )}
      </RecentlyWrapper>
    </DefaultLayout>
  );
}

export default observer(RecentlyTemplate);

import { useEffect, useMemo } from 'react';
import { toJS } from 'mobx';
import useStores from 'stores/useStores';
import PropTypes from 'prop-types';

import Image from 'components/atoms/Image';
import HeaderModalWrapper from 'components/molecules/Modal/HeaderModalWrapper';

import { pushRoute } from 'childs/lib/router';
import { useWindowSize } from 'hooks';

import {
  HistoryModalWrapper,
  MenuSection,
  MenuCounts,
  MenuDeleteButton,
  ContentSection,
  ContentItem,
  ContentDeleteButton,
  ContentEmpty,
} from './Styled';

const IMAGE_PATH = {
  DELETE_IMAGE: '/static/icon/like_item_delete.png',
  NO_DATA: '/static/icon/icon_no_data.png',
};

function HistoryModal({ isModalOpen, onCloseModal }) {
  const { mypageRecentlySeen } = useStores();
  const { width: windowWidth } = useWindowSize();

  const histoyItems = toJS(mypageRecentlySeen.list);
  const ContentItemLength = useMemo(() => (windowWidth - 43) / 3, [
    windowWidth,
  ]);

  useEffect(() => {
    return () => (document.documentElement.style.overflow = 'initial');
  }, []);

  const onClickDeleteItem = (e, dealsId) =>
    mypageRecentlySeen.removeItem(e, dealsId);

  const onClickAllDeleteItem = () => mypageRecentlySeen.removeItemAll();

  const onClickSelectItem = (dealId) =>
    pushRoute(`/productdetail?deals=${dealId}`);

  return (
    <HeaderModalWrapper
      isModalOpen={isModalOpen}
      headerStatus={{ title: '최근 본 상품', close: true }}
      onCloseModal={onCloseModal}
    >
      <HistoryModalWrapper>
        {/* 상단 메뉴 */}
        <MenuSection>
          <MenuCounts>총 {histoyItems?.length}개</MenuCounts>
          <MenuDeleteButton onClick={() => onClickAllDeleteItem()}>
            전체 삭제
          </MenuDeleteButton>
        </MenuSection>
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
            <div>
              <Image src={IMAGE_PATH.NO_DATA} width={'60px'} height={'60px'} />
              <div>최근 본 상품이 없습니다.</div>
            </div>
          </ContentEmpty>
        )}
      </HistoryModalWrapper>
    </HeaderModalWrapper>
  );
}

HistoryModal.propTypes = {};

export default HistoryModal;

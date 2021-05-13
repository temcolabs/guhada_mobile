import { memo } from 'react';
import PropTypes from 'prop-types';

import { pushRoute } from 'childs/lib/router';
import Image from 'components/atoms/Image';

import {
  Wrapper,
  ImageSection,
  ContentSection,
  Title,
  Contents,
} from './Styled';

/**
 * 리뷰 > 카드 > 상품 바로가기
 * @param {Number} dealId, 상품 ID
 * @param {String} imageUrl, 좌측 이미지
 * @param {String} title, 상품명
 * @param {String} contents, 상품 설명
 * @returns
 */
function CardProdInfo({ dealId, imageUrl, title, contents }) {
  return (
    <Wrapper onClick={() => pushRoute(`/productdetail?deals=${dealId}`)}>
      <ImageSection>
        <Image src={imageUrl} width={'50px'} height={'50px'} />
      </ImageSection>
      <ContentSection>
        <Title>{title}</Title>
        <Contents>{contents}</Contents>
      </ContentSection>
    </Wrapper>
  );
}

CardProdInfo.propTypes = {
  dealId: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  contents: PropTypes.string,
};

export default memo(CardProdInfo);

import css from './DealSection.module.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { LinkRoute } from 'childs/lib/router';

import DealItem, { dealShape } from './DealItem';

/**
 * Deal List
 * @param {String} header, 상단 제목
 * @param {Object} headerStyles, Custom header styling
 * @param {Array} deals, Deal list
 * @param {Boolean} horizontal, 스크롤 방향
 * @returns 
 */
const DealSection = ({ header, headerStyles, deals, horizontal = false }) => (
  <div className={css['deal-section']}>
    <div
      style={headerStyles && { ...headerStyles }}
      className={css['deal-section__name']}
    >
      {header}
    </div>
    <div
      className={cn(
        css['deal-section__items'],
        horizontal && css['items--horizontal']
      )}
    >
      {deals.map((deal) => (
        <LinkRoute
          key={deal.dealId}
          href={`/productdetail?deals=${deal.dealId}`}
        >
          <a>
            <DealItem deal={deal} horizontal={horizontal} />
          </a>
        </LinkRoute>
      ))}
    </div>
  </div>
);

DealSection.propTypes = {
  header: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(dealShape),
  horoizontal: PropTypes.bool,
  small: PropTypes.bool,
};

export default memo(DealSection);

import css from './DealItemSection.module.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { LinkRoute } from 'childs/lib/router';

import DealItem, { dealShape } from './DealItem';

const DealItemSection = ({ header, deals, horizontal = false }) => (
  <div className={css['deal-item-section']}>
    <div className={css['deal-item-section__name']}>{header}</div>
    <div
      className={cn(
        css['deal-item-section__items'],
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

DealItemSection.propType = {
  header: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(dealShape).isRequired,
  horoizontal: PropTypes.bool,
  small: PropTypes.bool,
  handleRoute: PropTypes.func.isRequired,
};

export default memo(DealItemSection);

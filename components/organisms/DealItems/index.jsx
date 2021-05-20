import css from './DealItems.module.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { LinkRoute } from 'childs/lib/router';

import DealItem, { dealShape } from './DealItem';

const DealItems = ({
  title,
  deals,
  horizontal = false,
  displaySeller = false,
  displayTags = true,
  isLazy = true,
}) => (
  <div className={css['deal-items']}>
    {title && <div className={css['deal-items__title']}>{title}</div>}
    <div
      className={cn(
        css['deal-items__wrapper'],
        horizontal && css['items--horizontal']
      )}
    >
      {deals.map((deal) => (
        <LinkRoute
          key={deal.dealId}
          href={`/productdetail?deals=${deal.dealId}`}
        >
          <a>
            <DealItem
              deal={deal}
              horizontal={horizontal}
              displaySeller={displaySeller}
              displayTags={displayTags}
              isLazy={isLazy}
            />
          </a>
        </LinkRoute>
      ))}
    </div>
  </div>
);

DealItems.propTypes = {
  title: PropTypes.string,
  deals: PropTypes.oneOfType([PropTypes.arrayOf(dealShape), PropTypes.object]),
  horoizontal: PropTypes.bool,
  displaySeller: PropTypes.bool,
  displayTags: PropTypes.bool,
  isLazy: PropTypes.bool,
};

export default memo(DealItems);

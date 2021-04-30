import css from './DealSection.module.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { LinkRoute } from 'childs/lib/router';

import DealItem, { dealShape } from './DealItem';

const DealSection = ({ header, deals, horizontal = false }) => (
  <div className={css['deal-section']}>
    <div className={css['deal-section__name']}>{header}</div>
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
  items: PropTypes.arrayOf(dealShape).isRequired,
  horoizontal: PropTypes.bool,
  small: PropTypes.bool,
  handleRoute: PropTypes.func.isRequired,
};

export default memo(DealSection);

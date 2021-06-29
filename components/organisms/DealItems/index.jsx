import css from './DealItems.module.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { LinkRoute } from 'childs/lib/router';
import DataEmpty from 'components/common/DataEmpty';
import DealItem, { dealShape } from './DealItem';

const DealItems = ({
  title,
  deals,
  thumbnail = 0,
  displaySeller = false,
  displayTags = true,
  isLazy = true,
}) => (
  <div className={css['deal-items']}>
    {title && <div className={css['deal-items__title']}>{title}</div>}
    <div
      className={cn(
        css['deal-items__wrapper'],
        thumbnail === -1 && css['items--horizontal']
      )}
    >
      {deals.length
        ? deals.map((deal) => (
            <LinkRoute
              key={deal.dealId}
              href={`/productdetail?deals=${deal.dealId}`}
            >
              <a>
                <DealItem
                  deal={deal}
                  thumbnail={thumbnail}
                  displaySeller={displaySeller}
                  displayTags={displayTags}
                  isLazy={isLazy}
                />
              </a>
            </LinkRoute>
          ))
        : thumbnail > -1 && <DataEmpty PADDING="50px">결과 없음</DataEmpty>}
    </div>
  </div>
);

DealItems.propTypes = {
  title: PropTypes.string,
  deals: PropTypes.oneOfType([PropTypes.arrayOf(dealShape), PropTypes.object]),
  thumbnail: PropTypes.number,
  displaySeller: PropTypes.bool,
  displayTags: PropTypes.bool,
  isLazy: PropTypes.bool,
};

export default memo(DealItems);

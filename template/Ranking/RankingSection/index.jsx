import { memo } from 'react';
import css from './RankingSection.module.scss';
import PropTypes from 'prop-types';

import RankItem, { rankShape } from './RankItem';
import Loading from 'components/common/loading/Loading';

const RankingSection = ({ rank, handleSearch, count = 50 }) => {
  return (
    <div className={css['ranking__section']}>
      {rank.length > 0 ? (
        rank
          .slice(0, count)
          .map((rankItem, idx) => (
            <RankItem
              key={rankItem.word}
              rank={rankItem}
              idx={idx}
              handleClick={() => handleSearch(rankItem)}
            />
          ))
      ) : (
        <Loading />
      )}
    </div>
  );
};

RankingSection.propTypes = {
  rank: PropTypes.arrayOf(rankShape).isRequired,
  handleSearch: PropTypes.func,
  count: PropTypes.number,
};

export default memo(RankingSection, (prevProps, nextProps) => {
  return prevProps.rank === nextProps.rank;
});

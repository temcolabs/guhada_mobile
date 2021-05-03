import { memo } from 'react';
import css from './RankingSection.module.scss';
import PropTypes from 'prop-types';

import RankItem, { rankShape } from './RankItem';
import Loading from 'components/common/loading/Loading';

const RankingSection = ({ rank, handleSearch }) => {
  return (
    <div className={css['ranking__section']}>
      {rank.length ? (
        rank
          .slice(0, 100)
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
};

export default memo(RankingSection, (prevProps, nextProps) => {
  return prevProps.rank === nextProps.rank;
});

import css from './RankingSection.module.scss';
import PropTypes from 'prop-types';

import RankItem, { rankShape } from './RankItem';

const RankingSection = ({ ranks, toSearch }) => (
  <div className={css['ranking__section']}>
    {ranks.map((rank, idx) => (
      <RankItem
        key={rank.word}
        rank={rank}
        idx={idx}
        onClick={
          rank.id
            ? () => toSearch({ brand: rank.id, enter: 'brand' })
            : () => toSearch({ keyword: rank.word, enter: 'keyword' })
        }
      />
    ))}
  </div>
);

RankingSection.propTypes = {
  ranks: PropTypes.arrayOf(rankShape).isRequired,
};

export default RankingSection;

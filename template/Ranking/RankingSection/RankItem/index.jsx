import css from './RankItem.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const RankChangeIcon = ({ rankChange }) => {
  if (rankChange > 0) {
    return (
      <div className={cn(css['change'], css['change--up'])}>
        {Math.abs(rankChange)}
        <div className={css['icon-up']} />
      </div>
    );
  } else if (rankChange < 0) {
    return (
      <div className={cn(css['change'], css['change--down'])}>
        {Math.abs(rankChange)}
        <div className={css['icon-down']} />
      </div>
    );
  } else if (rankChange === 0) {
    return <div className={css['keep']} />;
  }
  return <div className={cn(css['change'], css['change--up'])}>NEW</div>;
};

const RankItem = ({ rank, idx, onClick }) => (
  <div className={css['rank-item']} onClick={onClick}>
    <div className={cn(css['text--idx'], idx < 3 && css['text--top'])}>
      {idx + 1}
    </div>
    <div className={css['text--word']}>{rank.word}</div>
    <RankChangeIcon rankChange={rank.rankChange} />
  </div>
);

export const rankShape = PropTypes.shape({
  word: PropTypes.string.isRequired,
  rankChange: PropTypes.oneOfType(PropTypes.string, PropTypes.number)
    .isRequired,
  id: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
});

RankItem.propTypes = {
  rank: rankShape.isRequired,
  idx: PropTypes.number.isRequired,
};

export default RankItem;

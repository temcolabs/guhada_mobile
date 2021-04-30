import css from './RankingSection.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { LinkRoute } from 'childs/lib/router';

import RankItem, { rankShape } from './RankItem';

const RankingSection = ({ ranks }) => (
  <div className={css['ranking__section']}>
    {ranks.map((rank, idx) => (
      <LinkRoute
        key={rank.word}
        href={
          rank.id
            ? `/adfgfdgafdg?asdf=${rank.id}`
            : `/adgfdgfda?qwrqwr=${rank.word}`
        }
      >
        <a>
          <RankItem rank={rank} idx={idx} />
        </a>
      </LinkRoute>
    ))}
  </div>
);

RankingSection.propTypes = {
  ranks: PropTypes.arrayOf(rankShape).isRequired,
};

export default observer(RankingSection);

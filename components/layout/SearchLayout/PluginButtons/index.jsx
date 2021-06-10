import css from './PluginButtons.modules.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { pushRoute } from 'childs/lib/router';
import openPopupCenter from 'childs/lib/common/openPopupCenter';

const PluginButtons = ({ top, kakao, history }) => (
  <div className={css['plugin-buttons']}>
    {top && (
      <div
        className={cn(css['button'], css['button--top'])}
        onClick={() => window.scrollTo(0, 0)}
      />
    )}
    {history && (
      <div
        className={cn(css['button'], css['button--history'])}
        onClick={() => pushRoute('/recently')}
      >
        {history.count > 0 && (
          <div className={css['history__count']}>{history.count}</div>
        )}
      </div>
    )}
    {kakao && (
      <div
        className={cn(css['button'], css['button--kakao'])}
        onClick={() =>
          openPopupCenter(
            'https://pf.kakao.com/_yxolxbT/chat',
            '구하다 채팅하기',
            500,
            700
          )
        }
      />
    )}
  </div>
);

PluginButtons.propTypes = {
  top: PropTypes.bool,
  kakao: PropTypes.bool,
  history: PropTypes.shape({
    count: PropTypes.number,
  }),
};

export default memo(PluginButtons);

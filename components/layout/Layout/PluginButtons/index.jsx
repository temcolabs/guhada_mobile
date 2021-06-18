import css from './PluginButtons.modules.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { pushRoute } from 'childs/lib/router';
import openPopupCenter from 'childs/lib/common/openPopupCenter';

const PluginButtons = ({ isScrollDown, recentCount, top, kakao, recent }) => (
  <div className={css['plugin-buttons']}>
    {top && isScrollDown && (
      <div
        className={cn(css['button'], css['button--top'])}
        onClick={() => window.scrollTo(0, 0)}
      />
    )}
    {recent && recentCount > 0 && (
      <div
        className={cn(css['button'], css['button--recent'])}
        onClick={() => pushRoute('/recently')}
      >
        <div className={css['recent__count']}>{recentCount}</div>
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
  isScrollDown: PropTypes.bool,
  recentCount: PropTypes.number,
  top: PropTypes.bool,
  kakao: PropTypes.bool,
  recent: PropTypes.bool,
};

export default memo(PluginButtons);

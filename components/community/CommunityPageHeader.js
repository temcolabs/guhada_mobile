import React from 'react';
import css from './CommunityPageHeader.module.scss';
import cn from 'classnames';

class CommunityPageHeader extends React.Component {
  render() {
    const { isBorderHidden, children } = this.props;
    return (
      <div className={cn(css.wrap)}>
        <h2
          className={cn(css.title, {
            [css.isBorderHidden]: isBorderHidden,
          })}
        >
          {children}
        </h2>
      </div>
    );
  }
}
export default CommunityPageHeader;

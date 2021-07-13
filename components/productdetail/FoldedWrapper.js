import { Component } from 'react';
import css from './FoldedWrapper.module.scss';
import cn from 'classnames';

/**
 * 접히는 형태의 컴포넌트
 */
class FoldedWrapper extends Component {
  state = {
    folded: true,
  };

  setFoleded = () => {
    this.setState({ folded: !this.state.folded });
  };

  render() {
    const { header, children, noline } = this.props;
    const { folded } = this.state;
    return (
      <div className={css.wrap}>
        <div
          className={cn(
            css.header,
            { [css.folded]: folded === true },
            { [css.noline]: noline === true }
          )}
          onClick={() => this.setFoleded()}
        >
          {header}
        </div>
        <div className={cn(css.children, { [css.folded]: folded === true })}>
          {children}
        </div>
      </div>
    );
  }
}

export default FoldedWrapper;

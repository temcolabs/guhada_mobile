import React from 'react';
import css from './SectionWrap.module.scss';

class SectionWrap extends React.Component {
  render() {
    return <div className={css.wrap}>{this.props.children}</div>;
  }
}

export default SectionWrap;

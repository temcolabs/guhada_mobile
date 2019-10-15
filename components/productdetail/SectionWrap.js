import React from 'react';
import css from './SectionWrap.module.scss';

class SectionWrap extends React.Component {
  render() {
    return (
      <div className={css.wrap} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default SectionWrap;

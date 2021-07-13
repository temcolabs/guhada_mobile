import { Component } from 'react';
import css from './SectionWrap.module.scss';

class SectionWrap extends Component {
  render() {
    return (
      <div className={css.wrap} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default SectionWrap;

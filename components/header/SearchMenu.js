import React, { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import { observer, inject } from 'mobx-react';
import KeywordMenu from './keyword/KeywordMenu';

@inject('searchitem', 'keyword')
@observer
class SearchMenu extends Component {
  render() {
    const { isVisible, onClose } = this.props;
    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.RIGHT}>
        <KeywordMenu onClose={onClose} />
      </SlideIn>
    );
  }
}

export default SearchMenu;

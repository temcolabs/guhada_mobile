import React, { Component } from 'react';
import cn from 'classnames';
import css from './ProductTab.module.scss';
class ProductTab extends Component {
  state = {
    selected: 'detailTab',
  };

  selectTab = selected => {
    const { tabRefMap } = this.props;
    this.setState({
      selected,
    });
    // console.log('tabRefMap.selected', tabRefMap[selected].current);

    window.scrollTo(0, tabRefMap[selected].current.offsetTop - 100);
  };

  render() {
    const { selected } = this.state;
    console.log('this.props.tabRefMap', this.props.tabRefMap);
    return (
      <div className={css.wrap}>
        <div
          className={cn(css.item, { [css.selected]: selected === 'detailTab' })}
          onClick={() => this.selectTab('detailTab')}
        >
          상세정보
        </div>
        <div
          className={cn(css.item, {
            [css.selected]: selected === 'inquiryTab',
          })}
          onClick={() => this.selectTab('inquiryTab')}
        >
          상품문의
        </div>
        <div
          className={cn(css.item, {
            [css.selected]: selected === 'sellerstoreTab',
          })}
          onClick={() => this.selectTab('sellerstoreTab')}
        >
          셀러스토어
        </div>
      </div>
    );
  }
}

export default ProductTab;

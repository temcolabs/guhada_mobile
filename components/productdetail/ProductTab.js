import React, { Component } from 'react';
import cn from 'classnames';
import css from './ProductTab.module.scss';
class ProductTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'detailTab',
      tabStyle: null,
      tabSize: 52,
    };

    this.tabRef = React.createRef();
    this.tabBoundaryRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleChangeScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleChangeScroll);
  }

  handleChangeScroll = () => {
    const offsetTop = this.tabBoundaryRef.current.offsetTop;
    const { tabRefMap } = this.props;
    let pageYOffset = window.pageYOffset;
    if (window.pageYOffset + this.state.tabSize > offsetTop) {
      this.setState({
        tabStyle: {
          position: 'fixed',
          top: 60,
        },
      });
    } else {
      this.setState({ tabStyle: null });
    }
    let pinGap = 141;

    if (tabRefMap['sellerstoreTab'].current.offsetTop - pinGap < pageYOffset)
      this.setState({
        selected: 'sellerstoreTab',
      });
    else if (tabRefMap['inquiryTab'].current.offsetTop - pinGap < pageYOffset)
      this.setState({
        selected: 'inquiryTab',
      });
    else
      this.setState({
        selected: 'detailTab',
      });
  };

  selectTab = selected => {
    const { tabRefMap } = this.props;
    this.setState({
      selected,
    });

    if (this.state.tabStyle !== null) {
      if (selected === 'detailTab') {
        window.scrollTo(0, tabRefMap[selected].current.offsetTop - 68);
        return;
      }
      window.scrollTo(0, tabRefMap[selected].current.offsetTop - 140);
    } else {
      if (selected === 'detailTab') {
        window.scrollTo(0, tabRefMap[selected].current.offsetTop - 120);
        return;
      }
      window.scrollTo(0, tabRefMap[selected].current.offsetTop - 192);
    }
  };

  render() {
    const { selected } = this.state;

    return (
      <>
        <div ref={this.tabBoundaryRef} />
        <div
          className={css.wrap}
          ref={this.tabRef}
          style={{ ...this.state.tabStyle }}
        >
          <div
            className={cn(css.item, {
              [css.selected]: selected === 'detailTab',
            })}
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
            <div className={css.dot} />
          </div>
        </div>
      </>
    );
  }
}

export default ProductTab;

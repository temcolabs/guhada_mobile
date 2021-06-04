import React, { Component, Fragment } from 'react';
import css from './CategorySlider.module.scss';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import cn from 'classnames';
import Router from 'next/router';
import { mainCategory } from 'childs/lib/constant/category';
import { pushRoute } from 'childs/lib/router';
import _ from 'lodash';

@inject('searchitem', 'category')
@observer
class CategorySlider extends Component {
  state = {
    selected: 0,
    isVisibleSubCategory: false,
  };

  scrollWrapRef = React.createRef(null);

  componentDidMount() {
    let asPath = Router.router.asPath;
    const category = mainCategory.item.find((item) => {
      return item.href === asPath;
    });
    if (_.isNil(category) === false) {
      this.setSelected(category.id);
    } else {
      this.setSelected(0);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Moved x position
    if (
      prevState.selected === 0 &&
      prevState.selected !== this.state.selected
    ) {
      const wrap = this.scrollWrapRef.current;
      const target = wrap.childNodes[this.state.selected];
      const targetX = target.getBoundingClientRect().x;
      const scrollToWidth = wrap.getBoundingClientRect().width / 2 - 22;
      wrap.scrollTo(targetX - scrollToWidth, 0);
    }
  }

  setSelected = (id) => {
    this.setState({
      selected: id,
    });
    const { setNavDealId } = this.props;
    setNavDealId(id);
    if (id === 1 || id === 2 || id === 3) {
      this.setState({ isVisibleSubCategory: true });
    } else {
      this.setState({ isVisibleSubCategory: false });
    }
    this.toScrollTop();
  };

  pushHref = (id) => {
    const category = mainCategory.item.find((item) => {
      return item.id === id;
    });
    this.setSelected(category.id);
    pushRoute(category.href);
  };

  toSearch = (category) => {
    let { searchitem } = this.props;
    searchitem.toSearch({ category: category, enter: 'category' });
  };

  toScrollTop = () => {
    window.scrollTo(0, 0);
  };

  render() {
    const { categoryList, category, scrollDirection } = this.props;
    // const { scrollDirection } = searchitem;
    const subCategory = toJS(category.category);
    return (
      <>
        <div
          ref={this.scrollWrapRef}
          className={cn(
            css.wrap,
            {
              [css.borderNone]: this.state.isVisibleSubCategory === true,
            },
            { [css.scrollDown]: scrollDirection === 'down' }
          )}
        >
          {categoryList.map((item, index) => {
            return (
              <div
                className={cn(css.title, {
                  [css.selected]: item.id === this.state.selected,
                })}
                onClick={() => {
                  // this.setSelected(item.id);
                  this.pushHref(item.id);
                }}
                key={index}
              >
                <div
                  className={cn(css.dot, {
                    [css.redDot]: item.flag === 'event',
                  })}
                />

                {item.title}
              </div>
            );
          })}
          {/* <img
            src={'/static/icon/btn-arrow2.png'}
            className={css.arrowIcon}
            alt=""
          /> */}
        </div>
        <div
          className={cn(css.subWrap, {
            [css.scrollDown]: scrollDirection === 'down',
          })}
          style={{
            display:
              this.state.isVisibleSubCategory === true
                ? 'inline-block'
                : 'none',
          }}
        >
          {subCategory.map((category, index) => {
            if (category.id === this.state.selected) {
              return (
                <Fragment key={index}>
                  <div onClick={() => this.toSearch(category.id)}>
                    {`전체보기`}
                  </div>
                  {category.children.map((subCategory, subIndex) => {
                    return (
                      <div
                        onClick={() => this.toSearch(subCategory.id)}
                        key={subIndex}
                      >
                        {subCategory.title}
                      </div>
                    );
                  })}
                </Fragment>
              );
            }
          })}
        </div>
      </>
    );
  }
}

export default CategorySlider;

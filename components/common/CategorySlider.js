import React, { Component, Fragment } from 'react';
import css from './CategorySlider.module.scss';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import cn from 'classnames';

@inject('searchitem', 'category')
@observer
class CategorySlider extends Component {
  state = {
    selected: 0,
    isVisibleSubCategory: false,
  };

  setSelected = id => {
    this.setState({
      selected: id,
    });
    const { setNavDealId } = this.props;
    setNavDealId(id);
    if (id !== 0) {
      this.setState({ isVisibleSubCategory: true });
    } else {
      this.setState({ isVisibleSubCategory: false });
    }
  };

  toSearch = category => {
    let { searchitem } = this.props;
    searchitem.toSearch({ category: category, enter: 'category' });
  };

  render() {
    const { categoryList, category, searchitem } = this.props;
    const { scrollDirection } = searchitem;
    const subCategory = toJS(category.category);
    return (
      <>
        <div className={css.wrap}>
          {categoryList.map((item, index) => {
            return (
              <div
                className={cn(css.title, {
                  [css.selected]: item.id === this.state.selected,
                })}
                onClick={() => this.setSelected(item.id)}
                key={index}
              >
                <div className={css.dot} />
                {item.title}
              </div>
            );
          })}
          <img
            src={'/static/icon/btn-arrow2.png'}
            className={css.arrowIcon}
            alt=""
          />
        </div>
        <div
          className={cn(css.subWrap)}
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

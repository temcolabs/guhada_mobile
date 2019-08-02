import React, { Component } from 'react';
import css from './CategorySlider.module.scss';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import cn from 'classnames';

@inject('searchitem')
@observer
class CategorySlider extends Component {
  state = {
    selected: 0,
  };

  setSelected = id => {
    this.setState({
      selected: id,
    });
  };
  render() {
    let { category, searchitem, router } = this.props;
    // let query = router.query;
    let categoryList;

    if (category) categoryList = category;

    return (
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
    );
  }
}

export default CategorySlider;

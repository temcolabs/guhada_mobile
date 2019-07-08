import React, { Component } from 'react';
import css from './Category.module.scss';
import { inject, observer } from 'mobx-react';

@inject('category', 'searchitem')
@observer
class Category extends Component {
  grow(params) {
    var growDiv = document.getElementById(params);
    if (growDiv.clientHeight) {
      growDiv.style.height = 0;
    } else {
      var wrapper = document.querySelector(`.measuringWrapper${params}`);
      growDiv.style.height = wrapper.clientHeight + 'px';
    }
  }

  toSearch = category => {
    let { searchitem } = this.props;
    searchitem.toSearch({ category: category, enter: 'category' });
  };
  render() {
    const { category } = this.props;
    let categoryList = category.category;

    return <div className={css.wrap} />;
  }
}

export default Category;

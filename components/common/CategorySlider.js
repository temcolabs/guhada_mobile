import React, { Component } from 'react';
import css from './CategorySlider.module.scss';
import { inject, observer } from 'mobx-react';

@inject('searchitem')
@observer
class CategorySlider extends Component {
  render() {
    let categoryList = [
      { title: '전체보기', id: 1 },
      { title: '의류', id: 1 },
      { title: '슈즈', id: 1 },
      { title: '가방', id: 1 },
      { title: '악세사리', id: 1 },
      { title: '수영복', id: 1 },
      { title: '블라블라', id: 1 },
    ];

    let { category, searchitem } = this.props;

    if (category) categoryList = category;
    return (
      <div className={css.wrap}>
        {categoryList.map(item => {
          return (
            <div
              className={css.title}
              onClick={() => searchitem.toSearch({ category: item.id })}
            >
              {item.title}
            </div>
          );
        })}
      </div>
    );
  }
}

export default CategorySlider;

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Category.module.scss';

@inject('category', 'searchitem')
@observer
class Category extends Component {
  grow(params) {
    var growDiv = document.getElementById(params);
    if (growDiv.clientHeight) {
      growDiv.style.height = 0;
    } else {
      var wrapper = document.querySelector('.measuringWrapper');
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

    return (
      <ul className={css.tree}>
        {categoryList.map(categoryMain => {
          return (
            <li key={categoryMain.id}>
              <input
                type="checkbox"
                id={`${categoryMain.title}${categoryMain.key}category`}
                defaultChecked={false}
              ></input>
              <label
                htmlFor={`${categoryMain.title}${categoryMain.key}category`}
                onClick={() => this.grow(categoryMain.title + categoryMain.key)}
              >
                {categoryMain.title}
              </label>
              <ul id={`${categoryMain.title}${categoryMain.key}`}>
                <div className="measuringWrapper">
                  <li onClick={() => this.toSearch(categoryMain.id)}>
                    전체보기
                  </li>
                  {categoryMain.children.map(categoryItem => {
                    return (
                      <li
                        key={categoryItem.id}
                        className={css.arrow}
                        onClick={() => (
                          this.props.setIsCategoryVisible(true),
                          this.props.setCategoryId(categoryItem.id)
                        )}
                      >
                        {categoryItem.title}
                      </li>
                    );
                  })}
                </div>
              </ul>
            </li>
          );
        })}
        <label>브랜드</label>
      </ul>
    );
  }
}

export default Category;

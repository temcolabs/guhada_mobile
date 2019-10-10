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
      growDiv.style.borderTop = 0;
    } else {
      var wrapper = document.querySelector(`.measuringWrapper${params}`);
      growDiv.style.height = wrapper.clientHeight + 'px';
      growDiv.style.borderTop = `1px dashed #eeeeee`;
    }
  }

  toSearch = category => {
    let { searchitem, onClose } = this.props;
    searchitem.toSearch({ category: category, enter: 'category' });
    onClose();
  };

  render() {
    const { category, setIsBrandVisible } = this.props;
    let categoryList = category.category;

    return (
      <ul className={css.tree}>
        {categoryList.map(categoryMain => {
          return (
            <li key={`categoryMain${categoryMain.id}`} className={css.treeLi}>
              <input
                type="checkbox"
                id={`${categoryMain.title}${categoryMain.key}category`}
                defaultChecked={false}
              />
              <label
                htmlFor={`${categoryMain.key}category`}
                onClick={() => this.grow(categoryMain.key)}
              >
                {categoryMain.title}
              </label>
              <ul id={`${categoryMain.key}`}>
                <div className={`measuringWrapper${categoryMain.key}`}>
                  <li onClick={() => this.toSearch(categoryMain.id)}>
                    전체보기
                  </li>
                  {categoryMain.children.map(categoryItem => {
                    return (
                      <li
                        key={`categoryItem${categoryItem.id}`}
                        className={css.arrow}
                        onClick={() => {
                          this.props.setIsCategoryVisible(true);
                          this.props.setCategoryId(categoryItem.id);
                          this.props.setCategoryTitle(categoryItem.title);
                        }}
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
        <label
          onClick={() => {
            setIsBrandVisible(true);
          }}
        >
          브랜드
        </label>
      </ul>
    );
  }
}

export default Category;

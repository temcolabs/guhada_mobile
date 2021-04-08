import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Category.module.scss';
import cn from 'classnames';
import { toJS } from 'mobx';
import SearchEnum from 'childs/lib/constant/filter/SearchEnum';

@inject('category', 'searchitem')
@observer
class Category extends Component {
  grow(params) {
    const { category } = this.props;
    let categoryList = toJS(category.category);
    let growDiv = document.getElementById(params);
    let categoryLabel = document.querySelector(`.category${params}`);
    if (growDiv.clientHeight) {
      growDiv.style.height = 0;
      growDiv.style.borderTop = 0;
      categoryLabel.style.color = `#111111`;
    } else {
      let wrapper = document.querySelector(`.measuringWrapper${params}`);
      growDiv.style.height = wrapper.clientHeight + 'px';
      growDiv.style.borderTop = `1px dashed #eeeeee`;
      categoryLabel.style.color = `#5d2ed1`;
    }

    categoryList.map(categoryMain => {
      let growDiv = document.getElementById(categoryMain.key);
      let categoryLabel = document.querySelector(
        `.category${categoryMain.key}`
      );

      if (categoryMain.key !== params) {
        if (growDiv.clientHeight) {
          growDiv.style.height = 0;
          growDiv.style.borderTop = 0;
          categoryLabel.style.color = `#111111`;
        }
      }
    });
  }

  toSearch = category => {
    let { searchitem, onClose } = this.props;
    searchitem.toSearch({
      category: category,
      enter: 'category',
      searchSourceFrom: SearchEnum.GLOBAL_SEARCH_INPUT,
    });
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
                className={`category${categoryMain.key}`}
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

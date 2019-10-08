import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './CategoryDepth.module.scss';
import Router from 'next/router';
import cn from 'classnames';

@inject('category', 'searchitem')
@observer
class CategoryDepth extends Component {
  state = {
    categoryId: '',
  };

  componentDidUpdate() {
    if (this.state.categoryId !== this.props.categoryId) {
      const { category, categoryId } = this.props;
      category.returnCategory(categoryId);
      this.setState({ categoryId: categoryId });
    }
  }

  grow(params) {
    var growDiv = document.getElementById(params);
    if (growDiv.clientHeight) {
      growDiv.style.height = 0;
    } else {
      var wrapper = document.querySelector(`.measuringWrapper${params}`);
      growDiv.style.height = wrapper.clientHeight + 'px';
    }
  }

  toSearch = (category, subcategory) => {
    const { searchitem, onClose, onCloseMenu } = this.props;
    searchitem.toSearch({
      category: category,
      subcategory: subcategory,
    });
    onCloseMenu();
    onClose();
  };

  render() {
    const { category, searchitem } = this.props;
    const { categoryId } = this.state;
    let categoryList = category.categoryList;

    return (
      <ul className={css.tree}>
        <label onClick={() => this.toSearch(categoryId)}>전체보기</label>
        {categoryList !== undefined && categoryList.children
          ? categoryList.children.map(categoryMain => {
              return (
                <li key={categoryMain.id}>
                  <input
                    type="checkbox"
                    id={`${categoryMain.key}category`}
                    defaultChecked={false}
                  />
                  <label
                    className={cn({ [css.plus]: categoryMain.children })}
                    htmlFor={`${categoryMain.key}category`}
                    onClick={() =>
                      categoryMain.children
                        ? this.grow(categoryMain.key)
                        : this.toSearch(categoryId, categoryMain.id)
                    }
                  >
                    {categoryMain.title}
                  </label>
                  {categoryMain.children ? (
                    <ul id={`${categoryMain.key}`}>
                      <div className={`measuringWrapper${categoryMain.key}`}>
                        <li onClick={() => this.toSearch(categoryMain.id)}>
                          전체보기
                        </li>
                        {categoryMain.children.map(categoryItem => {
                          return (
                            <li
                              key={categoryItem.id}
                              className={css.arrow}
                              onClick={() =>
                                this.toSearch(categoryMain.id, categoryItem.id)
                              }
                            >
                              {categoryItem.title}
                            </li>
                          );
                        })}
                      </div>
                    </ul>
                  ) : null}
                </li>
              );
            })
          : null}
      </ul>
    );
  }
}

export default CategoryDepth;

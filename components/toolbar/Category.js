import React, { Component, Fragment } from 'react';
import css from './Category.module.scss';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import cn from 'classnames';
import { pushRoute } from 'lib/router';

/**
 * toolbar에서 category 클릭 시 나오는 데이터
 */
@inject('category', 'searchByFilter')
@observer
class Category extends Component {
  grow(params) {
    var growDiv = document.getElementById(`${params}toolbarGrowCategory`);
    var wrapper = document.querySelector(`.toolbarMeasuringWrapper${params}`);
    if (growDiv.clientHeight) {
      growDiv.style.height = wrapper.clientHeight + 'px';
      setTimeout(() => {
        growDiv.style.height = 0;
      }, 10);
    } else {
      growDiv.style.height = wrapper.clientHeight + 'px';
      setTimeout(() => {
        growDiv.style.height = 'auto';
      }, 500);
    }
  }

  toSearch = ({ category = '', subcategory = '' }) => {
    let { onClose } = this.props;
    pushRoute(
      `/search?category=${category}${subcategory &&
        `&subcategory=${subcategory}`}`
    );
    onClose();
  };

  render() {
    const { category } = this.props;
    let categoryList = toJS(category.category);

    return (
      <ul className={css.tree}>
        {categoryList.map((categoryMain) => {
          return (
            <li key={`${categoryMain.id}categoryMainKey`}>
              <input
                type="checkbox"
                id={`${categoryMain.key}toolbarcategory`}
                defaultChecked={false}
              />
              <label
                className={css.mainCheckboxLabel}
                htmlFor={`${categoryMain.key}toolbarcategory`}
                onClick={() => this.grow(categoryMain.key)}
              >
                {categoryMain.title}
              </label>
              <ul id={`${categoryMain.key}toolbarGrowCategory`}>
                <div className={`toolbarMeasuringWrapper${categoryMain.key}`}>
                  <li
                    onClick={() => this.toSearch({ category: categoryMain.id })}
                  >
                    전체보기
                  </li>
                  {categoryMain.children.map((categoryItem) => {
                    return (
                      <Fragment key={`${categoryItem.id}categoryItemKey`}>
                        <li>
                          <input
                            type="checkbox"
                            id={`${categoryItem.key}category`}
                            defaultChecked={false}
                          />
                          <label
                            className={css.plus}
                            htmlFor={`${categoryItem.key}category`}
                            onClick={() =>
                              categoryItem.children
                                ? this.grow(categoryItem.key)
                                : this.toSearch({ category: categoryItem.id })
                            }
                          >
                            {categoryItem.title}
                          </label>
                        </li>
                        <ul id={`${categoryItem.key}toolbarGrowCategory`}>
                          <div
                            className={`toolbarMeasuringWrapper${categoryItem.key}`}
                          >
                            <li
                              className={css.categorySecond}
                              onClick={() =>
                                this.toSearch({ category: categoryItem.id })
                              }
                            >
                              전체보기
                            </li>
                            {categoryItem.children.map((categorySecond) => {
                              return (
                                <Fragment
                                  key={`${categorySecond.key}categorySecondKey`}
                                >
                                  <li>
                                    <input
                                      type="checkbox"
                                      id={`${categorySecond.key}category`}
                                      defaultChecked={false}
                                    />
                                    <label
                                      className={cn(css.categoryItem, {
                                        [css.plus]: categorySecond.children,
                                      })}
                                      htmlFor={`${categorySecond.key}category`}
                                      onClick={() =>
                                        categorySecond.children
                                          ? this.grow(categorySecond.key)
                                          : this.toSearch({
                                              category: categoryItem.id,
                                              subcategory: categorySecond.id,
                                            })
                                      }
                                    >
                                      {categorySecond.title}
                                    </label>
                                  </li>
                                  {categorySecond.children ? (
                                    <ul
                                      id={`${categorySecond.key}toolbarGrowCategory`}
                                    >
                                      <div
                                        className={`toolbarMeasuringWrapper${categorySecond.key}`}
                                      >
                                        <li
                                          className={css.categoryLast}
                                          onClick={() =>
                                            this.toSearch({
                                              category: categorySecond.id,
                                            })
                                          }
                                        >
                                          전체보기
                                        </li>
                                        {categorySecond.children.map(
                                          (categoryLast) => {
                                            return (
                                              <li
                                                className={css.categoryLast}
                                                key={`${categoryLast.id}categoryLastKey`}
                                                onClick={() => {
                                                  this.toSearch({
                                                    category: categorySecond.id,
                                                    subcategory:
                                                      categoryLast.id,
                                                  });
                                                }}
                                              >
                                                {categoryLast.title}
                                              </li>
                                            );
                                          }
                                        )}
                                      </div>
                                    </ul>
                                  ) : null}
                                </Fragment>
                              );
                            })}
                          </div>
                        </ul>
                      </Fragment>
                    );
                  })}
                </div>
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default Category;

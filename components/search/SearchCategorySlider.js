import React, { Component } from 'react';
import css from '../common/CategorySlider.module.scss';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import cn from 'classnames';

@inject('searchitem')
@observer
class SearchCategorySlider extends Component {
  render() {
    let { category, searchitem, router } = this.props;
    let query = router.query;
    let categoryList = [];

    if (category) categoryList = category;

    let selected;

    if (query.subcategory !== '') {
      selected = Number(query.subcategory);
    } else if (query.category !== '') {
      selected = Number(query.category);
    }
    return (
      <div className={css.wrap}>
        {categoryList.map((item, index) => {
          return (
            <div
              className={cn(css.title, {
                [css.selected]: item.id === selected,
              })}
              onClick={() =>
                item.hierarchies !== undefined
                  ? item.children !== undefined
                    ? searchitem.toSearch({ category: item.id })
                    : searchitem.toSearch({
                        category: categoryList[0].id,
                        subcategory: item.id,
                      })
                  : searchitem.toSearch({ category: item.id })
              }
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

export default SearchCategorySlider;

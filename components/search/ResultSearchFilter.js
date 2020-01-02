import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import css from './TextButton.module.scss';
import { priceOption } from 'childs/lib/constant/filter/price';
import isTruthy from 'childs/lib/common/isTruthy';

@inject('searchitem')
@observer
class ResultSearchFilter extends Component {
  initSearchValue = () => {
    const { searchitem } = this.props;
    searchitem.resultKeyword = '';
  };

  onChange = e => {
    const { searchitem } = this.props;
    searchitem.setResultSearchFilter(e.target.value);
  };

  render() {
    const { searchitem } = this.props;
    return (
      <div className={css.wrap}>
        <input
          className={css.resultSearch}
          placeholder="결과 내 재검색"
          onFocus={() => this.initSearchValue()}
          onKeyUp={e => this.onChange(e)}
          onChange={e => this.onChange(e)}
          value={searchitem.resultKeyword}
        />
      </div>
    );
  }
}

export default ResultSearchFilter;

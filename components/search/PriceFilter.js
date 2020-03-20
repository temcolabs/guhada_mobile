import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import css from './TextButton.module.scss';
import { priceOption } from 'childs/lib/constant/filter/price';
import isTruthy from 'childs/lib/common/isTruthy';
import _ from 'lodash';

@inject('searchitem', 'alert')
@observer
class PriceFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minPrice: props.query.minPrice,
      maxPrice: props.query.maxPrice,
    };
  }

  componentDidMount() {
    let { query, searchitem } = this.props;
    this.setState({
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    });
    searchitem.setPriceFilter({
      min: query.minPrice,
      max: query.maxPrice,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let { query, searchitem } = this.props;

    if (!_.isEqual(prevProps.query, query)) {
      console.log('componentDidUpdate');
      this.setState({
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      });
      searchitem.setPriceFilter({
        min: query.minPrice,
        max: query.maxPrice,
      });
    }
  }

  onChangeMinPrice = e => {
    this.setState({ minPrice: Number(e.target.value) });
  };

  onChangeMaxPrice = e => {
    this.setState({ maxPrice: Number(e.target.value) });
  };

  searchPriceFilter = () => {
    const { searchitem, alert } = this.props;
    console.log('searchPriceFilter');
    if (Number(searchitem.minPrice) > Number(searchitem.maxPrice)) {
      alert.showAlert('최대 가격은 최소 가격보다 커야 합니다.');
      return false;
    } else {
      searchitem.setPriceFilter({
        min: searchitem.minPrice,
        max: searchitem.maxPrice,
      });
    }
  };

  setPriceFilter = ({ min, max }) => {
    console.log('setPriceFilter');
    const { searchitem } = this.props;
    this.setState({ minPrice: Number(min), maxPrice: Number(max) });
    searchitem.setPriceFilter({ min: min, max: max });
  };
  render() {
    const { searchitem } = this.props;
    console.log('searchitem.maxPrice', searchitem.maxPrice);
    return (
      <div className={css.wrap}>
        <div className={css.header}>가격</div>
        <div className={css.itemWrap}>
          {priceOption.map((price, index) => {
            return (
              <div
                className={cn(css.item, {
                  [css.selected]:
                    (String(searchitem.minPrice) === String(price.min) &&
                      String(searchitem.maxPrice) === String(price.max)) ||
                    (!isTruthy(searchitem.minPrice) &&
                      !isTruthy(searchitem.maxPrice) &&
                      price.min === 0 &&
                      price.max === 0),
                })}
                style={{ width: '100%' }}
                key={index}
                onClick={() => {
                  this.setPriceFilter({ min: price.min, max: price.max });
                }}
              >
                {price.label}
              </div>
            );
          })}
        </div>
        <div className={css.priceWrap}>
          <input
            type="number"
            placeholder="최소가격"
            value={searchitem.minPrice}
            onChange={e => {
              searchitem.minPrice = e.target.value;
            }}
          />
          <div>~</div>
          <input
            type="number"
            placeholder="최대가격"
            value={searchitem.maxPrice}
            onChange={e => {
              searchitem.maxPrice = e.target.value;
            }}
          />
          <button onClick={() => this.searchPriceFilter()}>적용</button>
        </div>
      </div>
    );
  }
}

export default PriceFilter;

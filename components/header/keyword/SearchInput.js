import React, { Component } from 'react';
import css from './SearchInput.module.scss';

class SearchInput extends Component {
  render() {
    return (
      <div className={css.header}>
        <div
          className={css.back}
          //  onClick={() => onClose()}
        />
        <input
          type="text"
          placeholder={'검색어를 입력해주세요'}
          onKeyUp={this.onChange}
          onChange={this.onChangeValue}
          value={this.state.inputValue}
        />
        <div
          className={css.delete}
          style={{ display: this.state.delete === true && 'block' }}
          onClick={() => this.clearInputValue()}
        />
        <div
          className={css.search}
          onClick={() => this.clickToSearch(this.state.inputValue)}
        />
      </div>
    );
  }
}

export default SearchInput;

import React, { Component } from 'react';
import css from './KeywordMenu.module.scss';
import cn from 'classnames';
import { observer, inject } from 'mobx-react';
import RecentItem from './RecentItem';
import PopularKeyword from './PopularKeyword';
import AutoComplete from './AutoComplete';
import Router from 'next/router';
import { pushRoute } from 'childs/lib/router';
import isTruthy from 'childs/lib/common/isTruthy';
import { devLog } from 'childs/lib/common/devLog';
import SearchEnum from 'childs/lib/constant/filter/SearchEnum';

@inject('searchitem', 'keyword', 'alert', 'searchHolder')
@observer
class KeywordMenu extends Component {
  state = {
    displayContent: 'keyword',
    keywordTab: 'recent',
    highlight: '',
    inputValue: '',
  };

  componentDidMount() {
    let { keyword, keywordText, searchHolder } = this.props;
    keyword.init();
    keyword.getPopularList();
    let query = Router.router.query;

    if (query.enter === 'keyword') {
      this.setState({ displayContent: '', inputValue: keywordText });
    }

    if (!isTruthy(searchHolder.placeholderData)) searchHolder.getPlaceholder();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isSearchVisible) {
      if (prevProps.isSearchVisible !== this.props.isSearchVisible) {
        this.onFocus();
        this.setState({ inputValue: this.props.keywordText });
      } else if (this.props.isSearchVisible !== false) {
        this.props.setIsSearchVisible(false);
      }
    }
  }

  onChange = (event) => {
    const { keyword } = this.props;

    if (event.key === 'Enter') {
      this.clickToSearch(event.target.value);
    }
    keyword.getAutoComplete(event.target.value);
    if (keyword.autoComplete === false) {
      this.setState({ displayContent: 'keyword' });
    } else if (event.target.value === '') {
      this.setState({ displayContent: 'keyword' });
    } else {
      if (this.state.highlight !== event.target.value) {
        this.setState({
          displayContent: 'autoComplete',
          highlight: event.target.value,
          autoCompleteListIndex: -1,
        });
      }
    }
  };

  onChangeValue = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  clearInputValue = () => {
    this.setState({ inputValue: '', displayContent: 'keyword' });
  };

  onFocus = () => {
    const { searchHolder } = this.props;
    searchHolder.placeholderData.placeholder = '';
    this.setState({ displayContent: 'keyword' });
  };

  onBlur = () => {
    this.setState({ displayContent: '' });
    const { field, searchHolder } = this.props;
    if (field && field.value && field.value.length === 0) {
      searchHolder.placeholderData.placeholder = searchHolder.placeHolderClone;
    }
  };

  changeKeyword = (header) => {
    this.setState({ keywordTab: header });
  };

  clickToSearch = (value = '') => {
    devLog('[KeyworkMenu] - clickToSearch called.');
    const { searchitem, keyword, alert, searchHolder } = this.props;
    let keywordValue = value;

    if (keywordValue.length === 0 || this.isKeywordPlaceholder(keywordValue)) {
      if (
        searchHolder.placeholderData.hasOwnProperty('placeholderLink') &&
        searchHolder.placeholderData.placeholderLink &&
        searchHolder.placeholderData.placeholderLink.length > 0
      )
        pushRoute(searchHolder.placeholderData.placeholderLink);
    } else {
      keyword.addItem(value);
      searchitem.toSearch({
        enter: 'keyword',
        keyword: value,
        searchSourceFrom: SearchEnum.GLOBAL_SEARCH_INPUT,
      });
      this.setState({ displayContent: '', inputValue: value });
    }
  };

  isKeywordPlaceholder = (keyword = '') => {
    const { searchHolder } = this.props;
    if (keyword === searchHolder.placeholderData.placeholder) return true;
    return false;
  };

  render() {
    const { keyword, onClose, isSearchVisible, searchHolder } = this.props;
    const { displayContent, keywordTab } = this.state;
    let recentKeywordList = keyword.list;
    let query = Router.router.query;

    return (
      <div className={css.wrapper}>
        <div className={css.header}>
          <div
            className={css.back}
            onClick={() =>
              query.enter === 'keyword' &&
              (this.state.displayContent === 'keyword' ||
                this.state.displayContent === 'autoComplete')
                ? this.onBlur()
                : query.enter === 'keyword' && this.state.displayContent === ''
                ? Router.back()
                : onClose()
            }
          />
          <input
            type="text"
            placeholder={searchHolder.placeholderData?.placeholder}
            onKeyUp={this.onChange}
            onChange={this.onChangeValue}
            value={this.state.inputValue}
            onFocus={this.onFocus}
          />
          <div
            className={css.delete}
            style={{
              display: this.state.inputValue !== '' ? 'block' : 'none',
            }}
            onClick={() => this.clearInputValue()}
          />
          <div
            className={css.search}
            onClick={() =>
              displayContent !== ''
                ? this.clickToSearch(this.state.inputValue)
                : this.onFocus()
            }
          />
        </div>
        <div
          className={css.recentWrap}
          style={{ display: displayContent === 'keyword' && 'block' }}
        >
          <div className={css.borderArea} />
          <div>
            <div className={css.searchHeaderWrap}>
              <div
                className={cn(css.headerItem, {
                  [css.selected]: keywordTab === 'recent',
                })}
                onClick={() => this.changeKeyword('recent')}
              >
                최근 검색어
              </div>
              <div
                className={cn(css.headerItem, {
                  [css.selected]: keywordTab === 'popular',
                })}
                onClick={() => this.changeKeyword('popular')}
              >
                인기 검색어
              </div>
            </div>
            {keywordTab === 'recent' ? (
              <>
                <div className={css.contentsWrap}>
                  {recentKeywordList.length > 0 ? (
                    recentKeywordList.map((recentKeyword) => {
                      return (
                        <div key={recentKeyword.name}>
                          <RecentItem
                            item={recentKeyword}
                            clickToSearch={this.clickToSearch}
                            removeItem={keyword.removeItem}
                          />
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <div className={css.contentsNoData} />
                      <div className={css.contentsNoDataText}>
                        최근에 검색한 내역이 없습니다.
                      </div>
                    </>
                  )}
                </div>

                <div className={css.autoCompleteWrap}>
                  <div
                    className={cn(css.autoCompleteIcon, {
                      [css.false]: keyword.autoComplete === false,
                    })}
                    onClick={() => keyword.setAutocomplete()}
                  >
                    자동 완성
                  </div>
                  <div
                    className={css.keywordAllDelete}
                    onClick={() => keyword.removeItemAll()}
                  >
                    전체삭제
                  </div>
                </div>
              </>
            ) : (
              <div className={css.popularKeywordWrap}>
                {keyword.popularList.length > 0 &&
                  keyword.popularList.map((list, index) => {
                    return (
                      <PopularKeyword
                        list={list}
                        key={index}
                        rank={index}
                        clickToSearch={this.clickToSearch}
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* 자동 완성 영역 */}
        <div
          className={css.autoCompleteTypeWrap}
          style={{
            display: displayContent === 'autoComplete' && 'block',
          }}
        >
          {keyword.autoCompleteList.length > 0 &&
            keyword.autoCompleteList.map((text, index) => {
              if (index < 10)
                return (
                  <AutoComplete
                    autoComplete={text}
                    key={index}
                    clickToSearch={this.clickToSearch}
                    highlight={this.state.highlight}
                    index={index}
                    onChangeValue={this.onChangeValue}
                  />
                );
            })}
        </div>
      </div>
    );
  }
}

export default KeywordMenu;

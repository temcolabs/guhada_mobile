import React, { Component } from 'react';
import css from './KeywordMenu.module.scss';
import cn from 'classnames';
import { observer, inject } from 'mobx-react';
import RecentItem from './RecentItem';
import PopularKeyword from './PopularKeyword';
import AutoComplete from './AutoComplete';
import Router from 'next/router';
import { pushRoute } from 'lib/router';

@inject('searchitem', 'keyword')
@observer
class KeywordMenu extends Component {
  state = {
    displayContent: 'keyword',
    keywordTab: 'recent',
    highlight: '',
    delete: false,
    inputValue: '',
  };

  componentDidMount() {
    let { keyword, keywordText } = this.props;
    keyword.init();
    let query = Router.router.query;

    if (query.enter === 'keyword') {
      this.setState({ displayContent: '', inputValue: keywordText });
    }
  }

  onChange = event => {
    const { keyword } = this.props;

    if (event.key === 'Enter') {
      this.clickToSearch(event.target.value);
    }
    keyword.getAutoComplete(event.target.value);
    if (keyword.autoComplete === false) {
      this.setState({ displayContent: 'keyword', delete: false });
    } else if (event.target.value === '') {
      this.setState({ displayContent: 'keyword', delete: false });
    } else {
      if (this.state.highlight !== event.target.value) {
        this.setState({
          displayContent: 'autoComplete',
          highlight: event.target.value,
          autoCompleteListIndex: -1,
        });
      }
      this.setState({ delete: true });
    }
  };

  onChangeValue = e => {
    this.setState({ inputValue: e.target.value });
  };

  clearInputValue = () => {
    this.setState({ inputValue: '', displayContent: 'keyword', delete: false });
  };

  onFocus = () => {
    let { setIsSearchVisible } = this.props;
    if (setIsSearchVisible) {
      setIsSearchVisible(true);
    }

    this.setState({ displayContent: 'keyword' });
  };

  onBlur = () => {
    this.setState({ displayContent: '' });
  };

  changeKeyword = header => {
    this.setState({ keywordTab: header });
  };

  clickToSearch = (value = '') => {
    const { searchitem, keyword } = this.props;
    keyword.addItem(value);
    searchitem.toSearch({ enter: 'keyword', keyword: value });
    this.setState({ displayContent: '' });
  };

  render() {
    const { keyword, onClose } = this.props;
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
                ? pushRoute('/')
                : onClose()
            }
          />
          <input
            type="text"
            placeholder={'검색어를 입력해주세요'}
            onKeyUp={this.onChange}
            onChange={this.onChangeValue}
            value={this.state.inputValue}
            onFocus={this.onFocus}
          />
          <div
            className={css.delete}
            style={{
              display:
                this.state.delete === true && this.state.displayContent !== ''
                  ? 'block'
                  : 'none',
            }}
            onClick={() => this.clearInputValue()}
          />
          <div
            className={css.search}
            onClick={() => this.clickToSearch(this.state.inputValue)}
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
                  {recentKeywordList.length > 0 &&
                    recentKeywordList.map(recentKeyword => {
                      return (
                        <div key={recentKeyword.name}>
                          <RecentItem
                            item={recentKeyword}
                            clickToSearch={this.clickToSearch}
                            removeItem={keyword.removeItem}
                          />
                        </div>
                      );
                    })}
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

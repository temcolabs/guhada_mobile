import { useState, useEffect } from 'react';
import { useBBSStore } from 'stores/bbs';
import css from './CommunitySidebar.module.scss';
import BoardMenus from './BoardMenus';
import MyBBS from './MyBBS';
import SearchInput from '../form/SearchInput';
import { withRouter } from 'next/router';
import useBBSSearchState from 'components/community/list/useBBSSearchState';

const CommunitySidebar = ({ router }) => {
  const [input, setInput] = useState('');
  const { searchQuery, handleSubmitSidebarSearch } = useBBSSearchState({
    query: router.query,
    asPath: router.asPath,
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // blocks refresh
    handleSubmitSidebarSearch({
      query: input,
    });
  };

  const handleChangeInput = (value) => {
    setInput(value);
  };

  return (
    <div className={css.wrap}>
      <MyBBS />

      <div>
        <form onSubmit={handleSubmit}>
          <SearchInput
            placeholder="검색어 입력"
            initialValue={searchQuery.query}
            onChange={handleChangeInput}
            wrapperClassname={css.searchKeywordInput}
          />
        </form>
      </div>

      <BoardMenus />
    </div>
  );
};

export default withRouter(CommunitySidebar);

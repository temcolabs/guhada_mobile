import css from './KeywordSection.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import KeywordItem from './KeywordItem';

const KeywordSection = ({ list, handleSearch, handleDelete, count }) => {
  return (
    <div className={css['keyword-section']}>
      {list.length > 0 ? (
        list
          .slice(0, count)
          .map(({ name, date }) => (
            <KeywordItem
              key={name}
              name={name}
              date={date}
              handleSearch={handleSearch}
              handleDelete={handleDelete}
            />
          ))
      ) : (
        <div className={css['no-items']}>최근에 검색한 내역이 없습니다.</div>
      )}
    </div>
  );
};

KeywordSection.propTypes = {
  list: PropTypes.any,
  handleSearch: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default observer(KeywordSection);

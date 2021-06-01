import css from './SearchableTreeFilter.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const SearchableTreeFilter = ({ title, dataList }) => {
  /**
   * states
   */
  const [isFilterChecked, setIsFilterChecked] = useState(false);

  /**
   * render
   */
  return (
    <div className={css['tree']}>
      <div
        className={cn(css['tree__title'], isFilterChecked && css['checked'])}
        onClick={() => setIsFilterChecked(!isFilterChecked)}
      >
        {title}
        {/* <span className={css['tree__title__depth']} /> */}
      </div>
      {isFilterChecked && <></>}
    </div>
  );
};

SearchableTreeFilter.propTypes = {
  title: PropTypes.string,
  dataList: PropTypes.any, // temp
};

export default SearchableTreeFilter;

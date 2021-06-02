import css from './SelectionFilter.module.scss';
import { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const SelectionFilter = ({ title, mapObject, handleSetSelected }) => {
  /**
   * states
   */
  const [selectedKey, setSelectedKey] = useState('');

  /**
   * handlers
   */
  const handleSetSelectedKey = (key) => {
    if (selectedKey === key) {
      handleSetSelected(Array.from(mapObject)[0][0]);
      setSelectedKey('');
    } else {
      handleSetSelected(key);
      setSelectedKey(key);
    }
  };

  /**
   * render
   */
  return (
    <div className={css['selection']}>
      <div className={css['selection__title']}>{title}</div>
      <div className={css['selection__items']}>
        {Array.from(mapObject).map(([key, value]) => (
          <div
            key={key}
            className={css['item']}
            onClick={() => handleSetSelectedKey(key)}
          >
            <span
              className={cn(
                css['item__check'],
                selectedKey === key && css['checked']
              )}
            />
            {value}
          </div>
        ))}
      </div>
    </div>
  );
};

SelectionFilter.propTypes = {
  title: PropTypes.string,
  mapObject: PropTypes.instanceOf(Map),
  handleSelect: PropTypes.func,
};

export default SelectionFilter;

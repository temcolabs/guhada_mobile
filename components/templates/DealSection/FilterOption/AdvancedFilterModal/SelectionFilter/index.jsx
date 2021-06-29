import css from './SelectionFilter.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

const SelectionFilter = ({
  title,
  mapObject,
  selectedKey,
  handleSetSelected,
}) => {
  /**
   * handlers
   */
  const handleSetSelectedKey = (key) => {
    if (selectedKey === key) {
      handleSetSelected('ANY');
    } else {
      handleSetSelected(key);
    }
  };

  /**
   * render
   */
  return (
    <div className={css['selection-filter']}>
      <div className={css['filter__title']}>{title}</div>
      <div className={css['filter__items']}>
        {Array.from(mapObject).map(([key, value]) => (
          <div
            key={key}
            className={cn(
              css['item'],
              selectedKey === key && css['item--checked']
            )}
            onClick={() => handleSetSelectedKey(key)}
          >
            <div>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

SelectionFilter.propTypes = {
  title: PropTypes.string,
  mapObject: PropTypes.instanceOf(Map),
  selectedKey: PropTypes.string,
  handleSelect: PropTypes.func,
};

export default SelectionFilter;

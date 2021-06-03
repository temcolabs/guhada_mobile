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
      // handleSetSelected(Array.from(mapObject)[0][0]);
      handleSetSelected('ANY');
    } else {
      handleSetSelected(key);
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
  selectedKey: PropTypes.string,
  handleSelect: PropTypes.func,
};

export default SelectionFilter;

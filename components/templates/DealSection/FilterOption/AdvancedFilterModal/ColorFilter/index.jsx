import css from './ColorFilter.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Attribute from './Attribute';

const ColorFilter = ({ title, attributes, currentFilters, setFilters }) => {
  /**
   * handlers
   */
  const handleSetFilter = (id, colorName) => {
    const matchIndex = currentFilters.findIndex(
      ({ filterAttributeId }) => filterAttributeId === id
    );

    if (matchIndex > -1) {
      const nextFilters = [
        ...currentFilters.slice(0, matchIndex),
        ...currentFilters.slice(matchIndex + 1),
      ];
      setFilters(nextFilters);
    } else {
      const nextFilters = [
        ...currentFilters.slice(),
        // { filterAttributeId: id, title: colorName },
        { filterAttributeId: id, title: '색상' },
      ];
      setFilters(nextFilters);
    }
  };

  /**
   * render
   */
  return (
    <div className={css['color-filter']}>
      <div className={css['filter__title']}>{title}</div>
      <div className={css['filter__items']}>
        {attributes.map(({ id, name, colorName }) => {
          const isChecked = currentFilters.some(
            ({ filterAttributeId }) => filterAttributeId === id
          );

          return (
            <Attribute
              key={id}
              colorName={colorName}
              id={id}
              name={name}
              isChecked={isChecked}
              handleSetFilter={handleSetFilter}
            />
          );
        })}
      </div>
    </div>
  );
};

ColorFilter.propTypes = {
  title: PropTypes.string,
  attributes: PropTypes.any,
  currentFilters: PropTypes.any,
  setFilters: PropTypes.func,
};

export default observer(ColorFilter);

import css from './AttributeFilter.module.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Attribute from './Attribute';

const AttributeFilter = ({ title, attributes, currentFilters, setFilters }) => {
  /**
   * handlers
   */
  const handleSetFilter = (id, title) => {
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
        { filterAttributeId: id, title },
      ];
      setFilters(nextFilters);
    }
  };

  /**
   * render
   */
  return (
    <div className={css['attribute-filter']}>
      <div className={css['filter__title']}>{title}</div>
      <div className={css['filter__items']}>
        {attributes.map(({ id, name }) => {
          const isChecked = currentFilters.some(
            ({ filterAttributeId }) => filterAttributeId === id
          );

          return (
            <Attribute
              key={id}
              title={title}
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

AttributeFilter.propTypes = {
  title: PropTypes.string,
  attributes: PropTypes.any,
  currentFilters: PropTypes.any,
  setFilters: PropTypes.func,
};

export default observer(AttributeFilter);

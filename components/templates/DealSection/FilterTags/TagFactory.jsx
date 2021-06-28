import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import useStores from 'stores/useStores';

const TagFactory = ({ filters, submitFilter }) => {
  const titleSet = new Set(filters.map(({ title }) => title));

  return Array.from(titleSet).map((uniqueTitle) => (
    <button
      key={uniqueTitle}
      onClick={() =>
        submitFilter({
          filters: filters.filter(({ title }) => title !== uniqueTitle),
        })
      }
    >
      {uniqueTitle}
    </button>
  ));
};

TagFactory.propTypes = {
  filters: PropTypes.array,
  submitFilter: PropTypes.func,
};

export const CategorySearchTag = observer(({ categoryIds }) => {
  const { searchByFilter: searchByFilterStore } = useStores();
  const [title, setTitle] = useState('카테고리');
  useEffect(() => {
    if (categoryIds.length > 2) {
      setTitle('카테고리');
      return;
    }
    const id = parseInt(categoryIds[categoryIds.length - 1]);
    const stack = toJS(searchByFilterStore.unfungibleCategories);
    while (stack.length > 0) {
      const curr = stack.pop();
      if (curr.id === id) {
        return setTitle(curr.title);
      }
      if (curr.children) {
        stack.push.apply(stack, curr.children);
      }
    }
  }, [categoryIds]);
  return <>{title}</>;
});

export default TagFactory;

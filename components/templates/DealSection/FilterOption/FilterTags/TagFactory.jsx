import PropTypes from 'prop-types';

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

export default TagFactory;

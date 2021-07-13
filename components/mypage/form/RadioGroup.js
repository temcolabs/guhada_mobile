import PropTypes from 'prop-types';
import css from './RadioGroup.module.scss';
import useChangeOption from 'lib/hooks/useChangeOption';
import cn from 'classnames';

export default function RadioGroup({
  name = '', // unique string
  options = [], // Array<{ label: string, value: any }>
  onChange, // 파라미터로 선택된 value가 전달된다.
  initialValue, // 선택 옵션의 value
  wrapperStyle = {},
  isSingleItemInLine = false, // 한줄에 한 아이템
}) {
  const [value, label, handleChange] = useChangeOption({
    onChange,
    options,
    initialValue,
  });

  return (
    <div
      className={cn(css.wrap, { [css.isSingleItemInLine]: isSingleItemInLine })}
      style={wrapperStyle}
    >
      {options.map((option, index) => {
        const id = `${name}_${index}`;

        return (
          <div className={css.radioSet} key={id}>
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value || ''}
              onChange={(e) => {
                handleChange(e.target.value);
              }}
              checked={value === option.value}
            />
            <label htmlFor={id}>{option.label}</label>
          </div>
        );
      })}
    </div>
  );
}

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ),
  onChange: PropTypes.func,
};

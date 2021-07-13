import css from './TextInput.module.scss';
import useChangeInput from 'lib/hooks/useChangeInput';
import { nilToEmptyStr } from 'lib/common/nilToZero';
import cn from 'classnames';

export default function SearchInput({
  initialValue = '',
  onChange = (v) => {},
  wrapperStyle = {},
  placeholder,
  wrapperClassname,
}) {
  const { value = '', handleChange } = useChangeInput({
    initialValue,
    onChange,
  });

  return (
    <div className={cn(css.searchInput, wrapperClassname)} style={wrapperStyle}>
      <input
        value={nilToEmptyStr(value)}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        placeholder={placeholder}
        type="text"
      />
      <button type="submit" className={css.searchIcon} />
    </div>
  );
}

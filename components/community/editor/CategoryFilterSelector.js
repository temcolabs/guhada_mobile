import React from 'react';
import css from './CategoryFilterSelector.module.scss';
import SlideUpOptions from '../form/SlideUpOptions';
import useChangeOption from 'lib/hooks/useChangeOption';
import cn from 'classnames';

export default function CategoryFilterSelector({
  initialValue, // 선택한 필터 초기값
  onChange = (value) => {},
  options = [],
  placeholder = '',
}) {
  const [value, label, handleChange, optionsAvailable] = useChangeOption({
    onChange,
    options,
    initialValue,
  });

  const buttonLabel = !!value ? label : placeholder;

  return (
    <SlideUpOptions
      renderButton={() => {
        return (
          <div className={css.wrap}>
            <button
              type="button"
              className={cn(css.button, {
                [css.isClickable]: optionsAvailable.length > 0,
              })}
            >
              {buttonLabel}
            </button>
          </div>
        );
      }}
      options={optionsAvailable} // 선택된 값 제외
      onChangeOption={handleChange}
      topPosOnEnter="109px"
      topPosOnExit="109px"
    />
  );
}

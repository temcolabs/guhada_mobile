import React from 'react';
import css from './SearchInputOption.module.scss';
import { func } from 'prop-types';
import SlideUpOptions, { slideOptionsPropType } from '../form/SlideUpOptions';
import useChangeOption from 'lib/hooks/useChangeOption';

SearchInputOption.prototype = {
  options: slideOptionsPropType,
  onChange: func,
};

/**
 * 검색 입력 좌측의 옵션
 */
export default function SearchInputOption({
  onChange = (value) => {},
  options = [],
  initialValue,
}) {
  const [, label, handleChange, optionsAvailable] = useChangeOption({
    onChange,
    options,
    initialValue,
  });

  return (
    <SlideUpOptions
      renderButton={() => {
        return (
          <div className={css.wrap}>
            <button type="button" className={css.button}>
              {label}
            </button>
          </div>
        );
      }}
      options={optionsAvailable} // 선택된 값 제외
      onChangeOption={handleChange}
      topPosOnEnter="49px"
      topPosOnExit="49px"
    />
  );
}

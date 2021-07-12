import React from 'react';
import css from './SortButton.module.scss';
import { func } from 'prop-types';
import SlideUpOptions, { slideOptionsPropType } from '../form/SlideUpOptions';
import useChangeOption from 'hooks/useChangeOption';

SortButton.prototype = {
  options: slideOptionsPropType,
  onChange: func,
};

/**
 * 정렬하기 버튼
 * @param {} param0
 */
export default function SortButton({
  placeholder = '정렬',
  options = [], //
  onChange = (value) => {},
  initialValue = null,
  optionsWrapperStyle = { width: '130px' },
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
            <button className={css.button}>{label}</button>
          </div>
        );
      }}
      options={optionsAvailable} // 현재 선택된 값은 제외하고
      onChangeOption={handleChange}
      wrapperStyle={{
        display: 'inline-block',
      }}
      slideWrapperStyle={optionsWrapperStyle}
      topPosOnEnter={'30px'}
      topPosOnExit={'60px'}
    />
  );
}

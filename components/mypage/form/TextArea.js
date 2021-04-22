import React from 'react';
import _ from 'lodash';
import css from './TextArea.module.scss';
import cn from 'classnames';
import useChangeInput from 'components/hooks/useChangeInput';

export default function TextArea({
  initialValue = '',
  onChange = (v) => {},
  placeholder = '내용을 입력해주세요',
  maxSize = 1000,
  isResizable = true,
  textAreaStyle = {},
  isInputSizeVisible = true,
  inputSizePosition = 'OUTSIDE_BOTTOM_RIGHT',
}) {
  const { value, handleChange } = useChangeInput({
    initialValue,
    onChange,
  });

  return (
    <div className={css.wrap}>
      <textarea
        className={cn({ [css.isNoResize]: isResizable })}
        style={textAreaStyle}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
      />

      {isInputSizeVisible && (
        <div
          className={cn(css.inputSize, {
            [css.outsideBottomRight]:
              inputSizePosition === 'OUTSIDE_BOTTOM_RIGHT',
            [css.bottomRight]: inputSizePosition === 'BOTTOM_RIGHT',
          })}
        >
          <span className={css.inputSize__current}>
            {_.isNil(value) ? 0 : parseInt(value.length, 10)}
          </span>
          /{maxSize}
        </div>
      )}
    </div>
  );
}

import React, { useMemo } from 'react';
import SlideUpOptions from '../form/SlideUpOptions';
import css from './BoardSelector.module.scss';
import useChangeOption from 'components/hooks/useChangeOption';
import { useBBSStore } from 'stores/bbs';

/**
 * 글쓰기 화면에서 게시판(=category) 선택
 */
const BoardSelector = ({ onChange = () => {}, options, initialValue }) => {
  const [, label, handleChange, optionsAvailable] = useChangeOption({
    onChange,
    options,
    initialValue,
  });
  return (
    <SlideUpOptions
      renderButton={() => {
        return (
          <div className={css.boardSelector}>
            <button type="button">{label}</button>
          </div>
        );
      }}
      wrapperStyle={{}}
      options={optionsAvailable}
      onChangeOption={handleChange}
      optionStyle={{
        width: `calc(100% - 40px)`,
        height: '62px',
        margin: '0 20px',
        padding: '19px 0 20px',
        fontSize: '15px',
        lineHeight: '1.4',
        color: '#111111',
      }}
      topPosOnEnter="51px"
      topPosOnExit="51px"
    />
  );
};

export default BoardSelector;

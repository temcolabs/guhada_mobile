import { useState, useEffect } from 'react';

/**
 * 옵션을 선택하는 컴포넌트에 사용할 수 있는 커스텀 훅
 * @param {*} param0
 */
const useChangeOption = ({
  onChange = value => {},
  options = [], //
  initialValue,
}) => {
  const [value, setValue] = useState(null);
  const [label, setLabel] = useState(null);
  const [optionsAvailable, setOptionsVisible] = useState(options);

  const handleChange = value => {
    setValue(value);
    onChange(value);
  };

  // 라벨 업데이트
  useEffect(() => {
    const target = options.find(o => o.value === value);
    setLabel(target ? target.label : '');
    return () => {
      setLabel(null);
    };
  }, [options, value]);

  // 초기값 반영
  useEffect(() => {
    setValue(initialValue);
    return () => {
      setValue(null);
    };
  }, [initialValue]);

  // 선택 가능한 옵션 업데이트
  useEffect(() => {
    // 선택된 값 제외
    setOptionsVisible(options.filter(o => o.value !== value));
  }, [options, value]);

  return [value, label, handleChange, optionsAvailable];
};

export default useChangeOption;

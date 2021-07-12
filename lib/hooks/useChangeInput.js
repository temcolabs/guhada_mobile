import { useState, useEffect } from 'react';

/**
 * input element 상태 관리 hook
 * @param {} args
 */
export default function useChangeInput({
  initialValue,
  onChange = v => {},
  formatter,
}) {
  const [value, setValue] = useState(null);

  const handleChange = v => {
    const updatedValue = typeof formatter === 'function' ? formatter(v) : v;
    setValue(updatedValue);
    onChange(updatedValue);
  };

  // initialValue 업데이트 반영
  useEffect(() => {
    setValue(initialValue);
    return () => {
      setValue(null);
    };
  }, [initialValue]);

  return {
    value,
    handleChange,
  };
}

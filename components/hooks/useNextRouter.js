import { useState, useEffect } from 'react';
import Router from 'next/router';
/**
 * 옵션을 선택하는 컴포넌트에 사용할 수 있는 커스텀 훅
 * @param {*} param0
 */
const useNextRouter = () => {
  return { router: Router };
};

export default useNextRouter;

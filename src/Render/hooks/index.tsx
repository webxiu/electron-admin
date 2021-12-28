import React, { useEffect, useState } from 'react';

export const useDebounce = (data, time) => {
  let timer: NodeJS.Timeout;
  const [value, setValue] = useState(data);
  useEffect(() => {
    console.log(`111111`, 111111);
    timer = setTimeout(fn, time);
    return () => {
      console.log(`清除`);
      clearTimeout(timer);
    };
  }, [data, time]);
  const fn = () => {
    setValue(data);
  };
  return [value, setValue];
};

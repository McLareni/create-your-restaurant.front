import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export const useClickOutside = (ref: RefObject<HTMLElement | null>, callback: () => void): void => {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        savedCallback.current();
      }
    };
    document.addEventListener('mousedown', handleClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref]);
};
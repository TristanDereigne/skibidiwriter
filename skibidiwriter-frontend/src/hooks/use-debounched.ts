import { useCallback, useEffect, useRef } from "react";

export function useDebounced<A extends unknown[]>(
  callback: (...args: A) => void,
  delay: number,
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return useCallback(
    (...args: A) => {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delay,
      );
    },
    [delay],
  );
}

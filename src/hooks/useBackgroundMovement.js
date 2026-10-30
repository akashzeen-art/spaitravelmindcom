import { useEffect } from 'react';

export function useBackgroundMovement() {
  useEffect(() => {
    let x = 0;
    const interval = setInterval(() => {
      x -= 1;
      document.querySelectorAll('.first, .bg-dark').forEach((el) => {
        el.style.backgroundPositionX = `${x / 5}px`;
      });
    }, 10);

    return () => clearInterval(interval);
  }, []);
}

import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialSeconds = 300) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  const start = () => {
    setIsActive(true);
    setIsComplete(false);
  };

  const stop = () => {
    setIsActive(false);
  };

  const reset = (newSeconds = initialSeconds) => {
    setIsActive(false);
    setIsComplete(false);
    setSeconds(newSeconds);
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;

  return {
    seconds,
    isActive,
    isComplete,
    start,
    stop,
    reset,
    formatTime,
    progress
  };
};

export default useTimer;

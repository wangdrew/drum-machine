import { useRef, useCallback } from 'react';

type PulseProps = {
  onTrigger: () => void;
  BPM: number;

};

type PulseControls = {
  startPulse: () => void;
  stopPulse: () => void;
};

const usePulse = ({ onTrigger, BPM }: PulseProps): PulseControls => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const startPulse = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;

      const intervalInMilliseconds = ((60 / BPM) * 1000) / 4; // divide by 4 for 4 columns per quarter note (1 col == 16th note)

      intervalRef.current = setInterval(onTrigger, intervalInMilliseconds);
    }
  }, [BPM, onTrigger]);

  const stopPulse = useCallback(() => {
    if (isRunningRef.current) {
      isRunningRef.current = false;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, []);

  return {
    startPulse,
    stopPulse,
  };
};

export default usePulse;

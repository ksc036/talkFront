import { useState, useCallback, useEffect, useRef } from 'react';

import { DateTime } from 'luxon';

import { useDidMountEffect } from '@/hooks/useDidMountEffect';

import PickerItem from './PickerItem';
import { TimePickerContainer } from './TimePicker.style';

interface Props {
  value?: DateTime;
  height?: number;
  onChange?: (time: DateTime) => void;
  onOutsideClick?: () => void;
}

const TimePicker = ({
  value = DateTime.now(),
  height = 200,
  onChange,
  onOutsideClick,
}: Props) => {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [meridiem, setMeridiem] = useState<string>(
    value.toFormat('a', { locale: 'ko' }),
  );
  const [hour, setHour] = useState<string>(value.toFormat('h'));
  const [minute, setMinute] = useState<string>(value.toFormat('mm'));
  const ampm = ['오전', '오후'];
  const hours = ['12', ...Array.from(Array(11), (_, i) => `${i + 1}`)];
  const minutes = Array.from(Array(60), (_, i) => ('00' + i).slice(-2));

  const handleMeridiemClick = useCallback(
    (meridiem: string) => setMeridiem(meridiem),
    [],
  );
  const handleHourClick = useCallback((hour: string) => setHour(hour), []);
  const handleMinuteClick = useCallback(
    (minute: string) => setMinute(minute),
    [],
  );

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      !(e.target instanceof Node) ||
      pickerRef.current?.parentElement?.parentElement?.contains(e.target) ||
      !onOutsideClick
    )
      return;
    onOutsideClick();
  };

  useDidMountEffect(() => {
    if (!onChange) return;
    const time = DateTime.fromFormat(
      `${meridiem} ${hour}:${minute}`,
      'a h:mm',
      { locale: 'ko' },
    );
    onChange(value.set({ hour: time.hour, minute: time.minute }));
  }, [meridiem, hour, minute]);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  });

  return (
    <TimePickerContainer ref={pickerRef} height={height}>
      <PickerItem
        height={height}
        item={ampm}
        selectedValue={meridiem}
        onValueClick={handleMeridiemClick}
      />
      <PickerItem
        height={height}
        item={hours}
        selectedValue={hour}
        onValueClick={handleHourClick}
        isInfinite
      />
      <PickerItem
        height={height}
        item={minutes}
        selectedValue={minute}
        onValueClick={handleMinuteClick}
        isInfinite
      />
    </TimePickerContainer>
  );
};

export default TimePicker;

import { DateTime, Info } from 'luxon';

import {
  CalendarHeaderContainer,
  CalendarHeader,
  CalendarContent,
  CustomPickersDay,
} from './CalendarPickers.style';

interface CalendarPickerProps {
  size: number;
  backgroundColor: string;
  date: DateTime;
  startingDay: number;
  setTitleDate: React.Dispatch<React.SetStateAction<DateTime>>;
  selectedDate: DateTime;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateTime>>;
}

const CalendarPicker = ({
  size,
  backgroundColor,
  date,
  startingDay,
  setTitleDate,
  selectedDate,
  setSelectedDate,
}: CalendarPickerProps) => {
  const weekdays = Array.from(
    Array(7),
    (_, i) =>
      Info.weekdays('short', { locale: 'ko' })[(i + startingDay - 1) % 7],
  );
  const startOfMonth = date.set({ day: 1 }).set({ weekday: startingDay });
  const firstDay =
    startOfMonth > date.set({ day: 1 })
      ? startOfMonth.minus({ weeks: 1 })
      : startOfMonth;
  const dayOfMonth = Array.from(Array(42), (_, i) =>
    firstDay.plus({ days: i }),
  );

  return (
    <>
      <CalendarHeaderContainer size={size}>
        {weekdays.map((day, index) => (
          <CalendarHeader key={day} isRed={(index + startingDay - 1) % 7 === 6}>
            {day}
          </CalendarHeader>
        ))}
      </CalendarHeaderContainer>
      <CalendarContent size={size}>
        {dayOfMonth.map((value) => (
          <CustomPickersDay
            key={value.toFormat('yyyy-LL-dd')}
            day={value}
            onDaySelect={(selectedValue) => {
              setSelectedDate(selectedValue);
              if (date.month !== selectedValue.month)
                setTitleDate(selectedValue);
            }}
            size={size}
            backgroundcolor={backgroundColor}
            isSunday={value.weekday === 7}
            isOutside={date.month !== value.month}
            today={
              value.toFormat('yyyy-LL-dd') ===
              DateTime.local().toFormat('yyyy-LL-dd')
            }
            selected={
              value.toFormat('yyyy-LL-dd') ===
              selectedDate.toFormat('yyyy-LL-dd')
            }
            disabled={
              value.toFormat('yyyy-LL-dd') <
              DateTime.now().toFormat('yyyy-LL-dd')
            }
            outsideCurrentMonth={false}
          />
        ))}
      </CalendarContent>
    </>
  );
};

export default CalendarPicker;

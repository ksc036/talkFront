import {
  MonthPicker,
  YearPicker,
  CalendarPickerView,
} from '@mui/x-date-pickers';
import { DateTime } from 'luxon';

import CalendarPicker from './CalendarPicker';
import { YearPickerWrapper, MonthPickerWrapper } from './PickerBody.style';

interface PickerBodyProps {
  size: number;
  backgroundColor: string;
  startingDay: number;
  viewMode: CalendarPickerView;
  setView: React.Dispatch<React.SetStateAction<CalendarPickerView>>;
  setTitleClick: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: DateTime;
  setSelectedDate: React.Dispatch<React.SetStateAction<DateTime>>;
  titleDate: DateTime;
  setTitleDate: React.Dispatch<React.SetStateAction<DateTime>>;
  tempDate: DateTime;
  setTempDate: React.Dispatch<React.SetStateAction<DateTime>>;
}

const PickerBody = ({
  size,
  backgroundColor,
  startingDay,
  viewMode,
  setView,
  setTitleClick,
  selectedDate,
  setSelectedDate,
  titleDate,
  setTitleDate,
  tempDate,
  setTempDate,
}: PickerBodyProps) => {
  switch (viewMode) {
    case 'year':
      return (
        <YearPickerWrapper size={size} backgroundColor={backgroundColor}>
          <YearPicker
            autoFocus
            date={selectedDate}
            onChange={(value) => {
              setTempDate(value);
              setView('month');
            }}
          />
        </YearPickerWrapper>
      );
    case 'month':
      return (
        <MonthPickerWrapper size={size} backgroundColor={backgroundColor}>
          <MonthPicker
            date={tempDate}
            onChange={(value) => {
              setTitleDate(value);
              setTitleClick(false);
              setView('day');
            }}
          />
        </MonthPickerWrapper>
      );
    default:
      return (
        <CalendarPicker
          size={size}
          backgroundColor={backgroundColor}
          date={titleDate}
          startingDay={startingDay}
          setTitleDate={setTitleDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      );
  }
};

export default PickerBody;

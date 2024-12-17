import { useState } from 'react';

import { Icon, Tooltip, useTheme } from '@wapl/ui';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react';

import DatePicker from '@/components/Common/DatePicker/DatePicker';
import TimePicker from '@/components/Common/TimePicker/TimePicker';

import * as S from './Styled';

interface Props {
  title?: string;
  date: DateTime;
  allDay?: boolean;
  isTimeInvalid?: boolean;
  pickerCheck?: boolean;
  onChange: (date: DateTime) => void;
  position?: 'top' | 'bottom';
}

const EventDateItem = observer(
  ({
    title,
    date,
    allDay,
    isTimeInvalid,
    pickerCheck = false,
    onChange,
    position = 'bottom',
  }: Props) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState<boolean>(false);

    const handleDateClick = () => {
      setIsDatePickerOpen((prev) => !prev);
    };

    const handleTimeClick = () => {
      setIsTimePickerOpen((prev) => !prev);
    };

    const handleDateChange = (date: DateTime) => {
      onChange(date);
    };

    const handleTimeChange = (date: DateTime) => {
      onChange(date);
    };
    const theme = useTheme();

    return (
      <S.EventDateItemContainer>
        {title}
        <S.PickerContainer>
          <Tooltip
            placement="top"
            title="시작일과 같거나 이후로 설정해 주세요."
            sx={{
              '.MuiTooltip-tooltip': {
                maxWidth: '250px',
                color: theme.Color.Background[0],
                backgroundColor: theme.Color.Gray[900],
              },
            }}
          >
            <S.DateWrapper
              className={`${isDatePickerOpen || pickerCheck ? 'selected' : ''}`}
              onClick={handleDateClick}
              pickerCheck={pickerCheck}
            >
              <span>{date.toFormat('yyyy.LL.dd')}</span>
              <Icon.CalendarLine
                className="ml-4"
                width={16}
                height={16}
                color={
                  !isDatePickerOpen && !pickerCheck
                    ? theme.Color.Gray[400]
                    : theme.Color.Gray[900]
                }
              />
            </S.DateWrapper>
          </Tooltip>
          {isDatePickerOpen && (
            <S.DatePickerWrapper position={position}>
              <DatePicker
                date={date}
                onDateClick={handleDateChange}
                onOutsideClick={handleDateClick}
              />
            </S.DatePickerWrapper>
          )}
        </S.PickerContainer>
        {!allDay && (
          <S.PickerContainer>
            <Tooltip
              disableHoverListener={!isTimeInvalid}
              placement="top-end"
              title="현재 시간 이후로 설정해 주세요."
              sx={{
                '.MuiTooltip-tooltip': {
                  maxWidth: '250px',
                  color: theme.Color.Background[0],
                  backgroundColor: theme.Color.Gray[900],
                },
              }}
            >
              <S.TimeWrapper
                className={`${
                  isTimePickerOpen || pickerCheck ? 'selected' : ''
                }`}
                isInvalid={isTimeInvalid}
                onClick={handleTimeClick}
                pickerCheck={pickerCheck}
                isTimePickerOpen={isTimePickerOpen}
              >
                <S.TimeValue>
                  {date.toFormat('a', { locale: 'ko' })}
                </S.TimeValue>
                <S.TimeValue>{date.toFormat('h:mm')}</S.TimeValue>
                <Icon.ArrowBackLine width={16} height={16} />
              </S.TimeWrapper>
            </Tooltip>
            {isTimePickerOpen && (
              <S.TimePickerWrapper position={position}>
                <TimePicker
                  value={date}
                  onChange={handleTimeChange}
                  onOutsideClick={handleTimeClick}
                />
              </S.TimePickerWrapper>
            )}
          </S.PickerContainer>
        )}
      </S.EventDateItemContainer>
    );
  },
);

export default EventDateItem;

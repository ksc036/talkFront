import { useState } from 'react';

import { Icon, Mui, Tooltip, useTheme } from '@wapl/ui';
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
}

const EventDateItem = observer(
  ({
    title,
    date,
    allDay,
    isTimeInvalid,
    pickerCheck = false,
    onChange,
  }: Props) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState<boolean>(false);
    const [dateAnchorEl, setDateAnchorEl] = useState<null | HTMLElement>(null);
    const [timeAnchorEl, setTimeAnchorEl] = useState<null | HTMLElement>(null);

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

    const handleDateOpen = (event: React.MouseEvent<HTMLElement>) => {
      setIsDatePickerOpen(true);
      setDateAnchorEl(event.currentTarget);
    };

    const handleTimeOpen = (event: React.MouseEvent<HTMLElement>) => {
      setIsTimePickerOpen(true);
      setTimeAnchorEl(event.currentTarget);
    };

    const theme = useTheme();

    return (
      <S.EventDateItemContainer>
        {title}
        <S.PickerContainer>
          <Tooltip
            disableHoverListener={!isTimeInvalid}
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
              onClick={(e) => handleDateOpen(e)}
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
            <Mui.Popover
              open={isDatePickerOpen}
              onClose={() => setDateAnchorEl(null)}
              anchorEl={dateAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  width: '256px',
                  height: '270px',
                  boxShadow: '0px 0px 8px rgb(0 0 0 / 20%)',
                  backgroundColor: 'transparent',
                  borderRadius: '12px',
                },
              }}
            >
              <S.DatePickerWrapper>
                <DatePicker
                  date={date}
                  onDateClick={handleDateChange}
                  onOutsideClick={handleDateClick}
                />
              </S.DatePickerWrapper>
            </Mui.Popover>
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
                onClick={(e) => handleTimeOpen(e)}
                pickerCheck={pickerCheck}
              >
                <S.TimeValue>
                  {date.toFormat('a', { locale: 'ko' })}
                </S.TimeValue>
                <S.TimeValue>{date.toFormat('h:mm')}</S.TimeValue>
              </S.TimeWrapper>
            </Tooltip>
            {isTimePickerOpen && (
              <Mui.Popover
                open={isTimePickerOpen}
                onClose={() => setTimeAnchorEl(null)}
                anchorEl={timeAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                PaperProps={{
                  sx: {
                    width: '212px',
                    height: '200px',
                    boxShadow: '0px 0px 8px rgb(0 0 0 / 20%)',
                    backgroundColor: 'transparent',
                    borderRadius: '12px',
                  },
                }}
              >
                <S.TimePickerWrapper>
                  <TimePicker
                    value={date}
                    onChange={handleTimeChange}
                    onOutsideClick={handleTimeClick}
                  />
                </S.TimePickerWrapper>
              </Mui.Popover>
            )}
          </S.PickerContainer>
        )}
      </S.EventDateItemContainer>
    );
  },
);

export default EventDateItem;

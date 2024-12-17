import { PickersDay } from '@mui/x-date-pickers';
import { styled } from '@wapl/ui';
import { DateTime } from 'luxon';

export const CalendarHeaderContainer = styled.div<{ size: number }>`
  height: calc(16px * ${({ size }) => size});
  display: flex;
`;

export const CalendarHeader = styled.div<{ isRed: boolean }>`
  width: 100%;
  height: 100%;
  text-align: center;
  color: ${({ isRed, theme: { Color } }) =>
    isRed ? '#f44336' : Color.Gray[900]};
  ${({ theme: { Font } }) => Font.Text.xxs.Medium};
`;

export const CalendarContent = styled.div<{ size: number }>`
  width: 100%;
  height: calc(208px * ${({ size }) => size});
`;

export const CustomPickersDay = styled(PickersDay<DateTime>, {
  shouldForwardProp: (prop: string) =>
    prop !== 'isOutside' && prop !== 'isSunday',
})<{
  isOutside: boolean;
  isSunday: boolean;
  size: number;
  backgroundcolor: string;
}>`
  width: calc(24px * ${({ size }) => size}) !important;
  height: calc(24px * ${({ size }) => size}) !important;
  margin: calc(4px * ${({ size }) => size}) !important;
  background-color: ${({ backgroundcolor }) => backgroundcolor} !important;
  border: 0px !important;
  color: ${({ isOutside, isSunday, disabled, theme: { Color } }) =>
    isOutside || disabled
      ? isSunday
        ? 'rgba(244, 67, 54, 0.3)'
        : Color.Gray[400]
      : isSunday
      ? '#F44336'
      : Color.Gray[900]} !important;
  &.MuiPickersDay-root {
    ${({ theme: { Font } }) => Font.Text.xxs.Medium};
  }
  &.Mui-selected {
    background-color: ${({ theme: { Color } }) => Color.Gray[100]} !important;
  }
  &.MuiPickersDay-today {
    background-color: ${({ isOutside, theme: { Color } }) =>
      isOutside ? 'rgba(255, 98, 88, 0.3)' : Color.Scarlet[500]} !important;
    color: white !important;
  }
`;

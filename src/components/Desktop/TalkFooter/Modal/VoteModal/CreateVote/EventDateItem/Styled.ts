import { styled } from '@wapl/ui';

export const EventDateItemContainer = styled.div`
  display: flex;
  height: 44px;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  align-items: center;
`;

export const PickerContainer = styled.div`
  display: flex;
  position: relative;
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  :first-of-type {
    margin-left: auto;
  }
  :not(:last-of-type) {
    margin-right: 4px;
  }
`;

export const DateWrapper = styled.div<{
  isInvalid?: boolean;
  pickerCheck: boolean;
}>`
  display: flex;
  width: 100px;
  padding: 6px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 6px;
  pointer-events: ${({ pickerCheck }) => !pickerCheck && 'none'};
  ${({ isInvalid, theme: { Color } }) =>
    isInvalid && `border: 1px solid ${Color.Validation.negative}`};
  cursor: pointer;
  :hover {
    background: ${({ theme: { Color } }) => Color.Gray[100]};
  }
  &.selected {
    span {
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
  }
  span {
    ${({ theme }) => theme.Font.Text.s.Regular};
    color: ${({ theme }) => theme.Color.Gray[400]};
    margin-right: 4px;
  }
`;

export const DatePickerWrapper = styled.div`
  padding: 16px;
  background: ${({ theme: { Color } }) => Color.Background[2]};
  border-radius: 12px;
`;

export const TimeWrapper = styled.div<{
  isInvalid?: boolean;
  pickerCheck: boolean;
}>`
  display: flex;
  width: 75px;
  box-sizing: border-box;
  padding: 5px;
  border-radius: 6px;
  cursor: pointer;
  pointer-events: ${({ pickerCheck }) => !pickerCheck && 'none'};
  border: 1px solid
    ${({ isInvalid, theme: { Color } }) =>
      isInvalid ? Color.Validation.negative : 'transparent'};
  :hover {
    background: ${({ theme: { Color } }) => Color.Gray[100]};
  }
  &.selected {
    span {
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
  }
  text-decoration: ${({ isInvalid }) => isInvalid && 'line-through'};
`;

export const TimeValue = styled.span`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[400]};
  & + & {
    margin-left: 4px;
  }
`;

export const TimePickerWrapper = styled.div`
  ${({ theme }) => theme.Font.Text.m.Regular};
  .css-uancbh {
    height: 100%;
  }
`;

import { styled } from '@wapl/ui';

export const EventDateItemContainer = styled.div`
  display: flex;
  height: 20px;
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
    margin-right: 6px;
  }
`;

export const DateWrapper = styled.div<{
  isInvalid?: boolean;
  pickerCheck: boolean;
}>`
  display: flex;
  width: 100%;
  gap: 4px;
  height: 28px;
  padding: 6px 8px;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 6px;
  border: ${({ pickerCheck, theme: { Color } }) =>
    pickerCheck ? `1px solid ${Color.Gray[300]}` : 'transparent'};
  pointer-events: ${({ pickerCheck }) => !pickerCheck && 'none'};
  ${({ isInvalid, theme: { Color } }) =>
    isInvalid && `border: 1px solid ${Color.Validation.negative}`};
  cursor: pointer;
  :hover {
    background: ${({ theme: { Color } }) => Color.Black[6]};
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

export const DatePickerWrapper = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  ${({ position }) => (position === 'bottom' ? 'top: 100%;' : 'bottom: 100%;')}
  z-index: 1;
  margin: 8px 0;
  padding: 16px;
  background: ${({ theme: { Color } }) => Color.Background[2]};
  box-shadow: 0px 0px 8px rgb(0 0 0 / 20%);
  border-radius: 12px;

  @media (max-width: 375px) {
    right: -30%;
  }

  @media (min-width: 376px) {
    right: 0;
  }
`;

export const TimeWrapper = styled.div<{
  isInvalid?: boolean;
  pickerCheck: boolean;
  isTimePickerOpen: boolean;
}>`
  display: flex;
  gap: 4px;
  height: 28px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  pointer-events: ${({ pickerCheck }) => !pickerCheck && 'none'};
  border: ${({ pickerCheck, theme: { Color } }) =>
    pickerCheck ? `1px solid ${Color.Gray[300]}` : 'transparent'};
  :hover {
    background: ${({ theme: { Color } }) => Color.Black[6]};
  }
  &.selected {
    span {
      color: ${({ theme }) => theme.Color.Gray[900]};
    }
  }
  text-decoration: ${({ isInvalid }) => isInvalid && 'line-through'};

  & svg {
    transform: ${({ isTimePickerOpen }) =>
      isTimePickerOpen ? 'rotate(90deg)' : 'rotate(-90deg)'};
    visibility: ${({ pickerCheck }) => !pickerCheck && 'hidden'};
  }
`;

export const TimeValue = styled.span`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[400]};
`;

export const TimePickerWrapper = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  ${({ position }) => (position === 'bottom' ? 'top: 100%;' : 'bottom: 100%;')}
  right: 0;
  z-index: 1;
  margin: 8px 0;

  .css-uancbh {
    height: 100%;
  }
`;

import { styled, Mui } from '@wapl/ui';

export const DatePickerContainer = styled.div<{ backgroundColor?: string }>`
  width: max-content;
  height: max-content;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const DatePickerHeader = styled.div<{ size: number }>`
  display: flex;
  width: calc(224px * ${({ size }) => size});
  height: 18px;
  padding: 0px 2px;
  margin-bottom: 12px;
  box-sizing: border-box;
`;

export const DatePickerBody = styled.div<{ size: number }>`
  width: calc(224px * ${({ size }) => size});
  height: calc(208px * ${({ size }) => size});
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  cursor: pointer;
  ${({ theme: { Font } }) => Font.Text.m.Medium};
  svg {
    margin-left: 4px;
  }
`;

export const TextButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ theme: { Font } }) => Font.Text.m.Medium};
`;

export const IconButton = styled(Mui.IconButton)`
  padding: 0;
  :first-of-type {
    margin-right: 12px;
  }
`;

export const CalendarPickerButtonWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

import { styled } from '@wapl/ui';

export const SearchBarWrapper = styled('div')<{
  searchBarWidth?: number;
  backGroundColor?: string;
  borderColor?: string;
}>`
  width: ${({ searchBarWidth }) => !searchBarWidth && '100%'};

  .MuiFilledInput-input {
    font-family: 'Spoqa Han Sans Neo';
    font-size: 14px !important;
    height: 18px !important;
    line-height: 18px !important;
    color: ${({ theme }) => theme.Color.Gray[900]};

    &::placeholder {
      font-family: 'Spoqa Han Sans Neo';
      font-size: 14px !important;
      height: 18px !important;
      line-height: 18px !important;
      color: ${({ theme }) => theme.Color.Gray[700]};
    }
  }

  .MuiFilledInput-root.MuiInputBase-root {
    background-color: ${({ backGroundColor }) => backGroundColor};
    outline: ${({ borderColor }) => `1px solid ${borderColor}`};
    border-radius: 8px;

    ::after {
      border: none;
    }
  }

  .MuiFilledInput-root:hover,
  .MuiInputBase-root.MuiInputBase-root.Mui-focused {
    background-color: ${({ theme }) => theme.Color.Background[0]};
    outline: ${({ borderColor }) =>
      borderColor ? `2px solid ${borderColor}` : 'none'};

    ::after {
      border: none;
    }
  }
`;

export const SearchLoadingWrapper = styled('div')`
  margin-right: 4px;
  align-items: center;
  display: flex;
  & svg {
    width: 20px;
    height: 20px;
  }
`;

export const SearchNumWrapper = styled('span')`
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  margin: 0 8px 0 14px;
`;

export const SearchNumDivider = styled('span')`
  &::after {
    content: '/';
  }
`;

export const SearchNumText = styled('span')<{ color?: string }>`
  &.prefix {
    color: ${({ color }) => color};
  }

  &.suffix {
    color: ${({ theme: { Color } }) => Color.Gray[900]};
  }

  &.noResult {
    color: ${({ theme: { Color } }) => Color.Gray[600]};
  }
`;

export const IconBtn = styled('button')`
  width: 16px;
  height: 16px;
  cursor: pointer;
  border: 0;
  padding: 0;
  background: none;
  flex-shrink: 0;
  &:disabled {
    & > svg {
      path {
        fill: ${({ theme: { Color } }) => Color.Gray[400]};
      }
    }
    pointer-events: none;
  }
  &:hover:not(:disabled) {
    background-color: ${({ theme: { Color } }) => Color.Black[4]};
  }
  &:active:not(:disabled) {
    background-color: ${({ theme: { Color } }) => Color.Black[6]};
    & > svg {
      path {
        fill: ${({ theme: { Color } }) => Color.Gray[900]};
      }
    }
  }
  color: red;
`;

export const ArrowBtnWrapper = styled('div')`
  display: flex;
  align-items: center;
`;

export const Splitter = styled('div')`
  width: 1px;
  height: 20px;
  background: ${({ theme: { Color } }) => Color.Gray[400]};
  margin-left: 8px;
  margin-right: 9px;
`;

export const CancelButton = styled('button')<{ color?: string }>`
  width: 30px;
  min-width: 30px;
  border: none;
  background-color: transparent;
  padding: 0px;
  font-size: 14px;
  color: ${({ color }) => color};
`;

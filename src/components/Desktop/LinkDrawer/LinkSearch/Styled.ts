import { styled } from '@wapl/ui';

interface SearchBarWrapperProps {
  backGroundColor?: string;
  borderColor?: string;
}

export const SearchBarWrapper = styled('div')<SearchBarWrapperProps>`
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

import { styled, Theme } from '@wapl/ui';

export const Wrapper = styled('li')<{
  isSelected?: boolean;
  theme: Theme;
  selectedColor?: string;
}>`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 2px solid transparent;
  border-bottom: 2px solid
    ${({ isSelected, selectedColor }) =>
      isSelected ? selectedColor : 'transparent'};
`;

export const IconWrapper = styled('div')<{
  isSelected?: boolean;
  theme: Theme;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  margin: 0 2px;

  ${({ isSelected, theme }) =>
    isSelected
      ? `
        background-color: ${theme.Color.Gray[100]};
        `
      : `
          &:hover {
            background-color: ${theme.Color.Gray[100]};
          }
        `}

  & path {
    fill: ${({ isSelected, theme }) =>
      isSelected ? '' : theme.Color.Gray[500]};
  }
`;

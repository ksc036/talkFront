import { styled, Theme } from '@wapl/ui';

export const Wrapper = styled('li')<{
  theme: Theme;
  isSelected: boolean;
}>`
  display: flex;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
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
`;

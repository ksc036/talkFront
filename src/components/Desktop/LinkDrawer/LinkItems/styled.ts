import { styled } from '@wapl/ui';

export const LinkWrapper = styled('div')`
  margin-bottom: 20px;
`;

export const LinkDate = styled('div')`
  height: 28px;
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[500]};
  display: flex;
  align-items: center;
`;

export const LinkItemsWrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(3, fit-content(100%));
  gap: 16px;
`;

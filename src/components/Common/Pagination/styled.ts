import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  display: flex;
  height: 18px;
  gap: 16px;
`;

export const IconWrapper = styled('button')<{
  isCurrent?: boolean;
  color?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 0;
  padding: 0;
  min-width: 9px;
  ${({ theme }) => theme.Font.Text.m.Medium};
  color: ${({ theme, isCurrent, color }) =>
    isCurrent ? color : theme.Color.Gray[900]};
`;

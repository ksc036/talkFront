import { styled } from '@wapl/ui';

export const EmptyWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: center;
`;

export const EmptyTitle = styled('div')`
  ${({ theme }) => theme.Font.Text.m.Regular};
`;

export const EmptyDescription = styled('div')`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

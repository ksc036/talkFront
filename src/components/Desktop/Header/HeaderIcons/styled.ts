import { styled } from '@wapl/ui';

export const IconWrapper = styled('button')<{ hasText: boolean }>`
  ${({ hasText }) =>
    hasText
      ? 'width: 48px; height: 50px; border-radius: 8px;'
      : 'width: 28px; height: 28px; border-radius: 50%;'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: none;
  border: 0;
  padding: 0;
  gap: 3px;
  margin-left: -4px;
  margin-right: -4px;
  ${({ theme }) => theme.Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[700]};

  :hover {
    background-color: ${({ theme }) => theme.Color.Black[6]};
  }
`;

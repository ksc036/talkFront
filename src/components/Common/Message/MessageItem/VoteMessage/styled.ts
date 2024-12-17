import { styled } from '@wapl/ui';

export const FirstRankWrapper = styled('div')`
  display: flex;
  align-items: center;
`;

export const FirstRankText = styled('span')`
  padding: 2px 6px;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.Color.White[100]};
  border-radius: 8px;
  white-space: nowrap;
`;

export const FirstRankContent = styled('div')<{ isLong: boolean }>`
  display: flex;
  max-width: ${({ isLong }) => (isLong ? '157px' : '182px')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin-left: 4px;
`;

export const OtherFirstRankText = styled('span')`
  ${({ theme }) => theme.Font.Text.s.Regular};
  padding-left: 4px;
  white-space: nowrap;
  color: ${({ theme }) => theme.Color.Gray[500]};
`;

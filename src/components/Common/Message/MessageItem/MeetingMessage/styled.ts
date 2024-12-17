import { styled } from '@wapl/ui';

export const MeetingDateTime = styled('div')`
  ${({ theme }) => theme.Font.Text.xxs.Regular};
  color: ${({ theme }) => theme.Color.Gray[500]};
`;

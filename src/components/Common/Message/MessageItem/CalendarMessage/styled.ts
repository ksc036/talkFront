import { styled } from '@wapl/ui';

export const CalendarMessageSubText = styled('span')`
  ${({ theme }) => theme.Font.Text.xxs.Regular};
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
  color: ${({ theme }) => theme.Color.Gray[500]};
`;

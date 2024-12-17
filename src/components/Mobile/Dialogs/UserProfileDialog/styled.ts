import { styled } from '@wapl/ui';

export const HeaderWrapper = styled(`span`)`
  display: flex;
  gap: 12px;
`;

export const IconWrapper = styled('div')`
  width: 24px;
  height: 24px;

  svg > path {
    fill: ${({ theme }) => theme.Color.Gray[700]};
  }
`;

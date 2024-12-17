import { styled } from '@wapl/ui';

export const HeaderWrapper = styled(`span`)`
  display: flex;
  gap: 12px;
`;

export const PaperStyle = {
  width: '160px',
  borderRadius: '12px',
};

export const ListItemText = styled('span')`
  color: ${({ theme }) => theme.Color.Gray[900]};
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  margin-left: 8px;
`;

export const IconWrapper = styled('div')`
  width: 24px;
  height: 24px;

  svg > path {
    fill: ${({ theme }) => theme.Color.Gray[700]};
  }
`;

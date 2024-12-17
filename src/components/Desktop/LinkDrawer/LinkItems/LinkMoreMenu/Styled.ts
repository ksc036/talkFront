import { Mui, styled } from '@wapl/ui';

export const MenuWrapper = styled('div')``;

export const Menu = styled(Mui.Menu)`
  .MuiPopover-paper {
    width: 160px;
    background: ${({ theme }) => theme.Color.Background[2]};
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  margin-top: 12px;
`;

export const MenuItem = styled(Mui.MenuItem)`
  height: 36px;
  padding: 0px 20px;
  display: flex;
  gap: 8px;
`;

export const MenuItemText = styled('span')`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  ${({ theme: { Font } }) => Font.Text.s.Regular};
`;

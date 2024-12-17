import { styled, Mui } from '@wapl/ui';

export const Menu = styled(Mui.Menu)`
  .MuiPopover-paper {
    width: 160px;
    background: ${({ theme }) => theme.Color.Background[2]};
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  .MuiMenuItem-root {
    min-height: 0px;
  }
`;

export const MenuItem = styled(Mui.MenuItem)`
  height: 36px;
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
`;

export const MenuItemText = styled('span')`
  margin-left: 8px;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

import { ContextMenu, styled, Mui } from '@wapl/ui';

export const BottomContextMenu = styled(ContextMenu)`
  z-index: 1350;
  .MuiPaper-root {
    overflow: unset;
  }
`;

export const DrawerTitle = styled(`div`)`
  ${({ theme }) => theme.Font.Text.l.Bold};
  display: flex;
  justify-content: center;
  height: 56px;
  align-items: center;
`;

export const DrawerList = styled(Mui.List)``;

export const DrawerListItem = styled(Mui.ListItemButton)`
  ${({ theme }) => theme.Font.Text.l.Regular};
  height: 48px;
`;

export const DrawerListText = styled(Mui.ListItemText)`
  ${({ theme }) => theme.Font.Text.l.Regular};
`;

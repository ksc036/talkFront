import { ContextMenu, Mui, styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  height: 100%;
`;

export const NoticeHeader = styled('div')`
  height: 56px;
`;

export const NoticeBody = styled('div')`
  height: calc(100% - 56px);
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const NoticeHeaderWrapper = styled('div')`
  padding: 10px 16px;
  display: flex;
`;

export const NoticeDetailText = styled('div')`
  padding: 16px;
  ${({ theme }) => theme.Font.Text.l.Regular};
  word-break: break-all;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const NoticeContent = styled('div')`
  margin-left: 12px;
  overflow: hidden;
  flex: 1 1 0%;
`;

export const NameText = styled('div')`
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const TimeText = styled('div')`
  margin-top: 6px;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const IconButton = styled(Mui.IconButton)`
  width: 28px;
  height: 28px;
  padding: 3px;
  &:hover {
    background: ${({ theme }) => theme.Color.Black[6]};
  }
`;

export const BottomContextMenu = styled(ContextMenu)`
  z-index: 1350;
`;

export const MenuTitle = styled('div')`
  ${({ theme }) => theme.Font.Text.l.Bold};
  text-align: center;
  padding: 18px 32px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const MenuItem = styled('div')`
  display: flex;
  align-items: center;
  padding: 14px 16px;
`;

export const MenuItemText = styled('span')`
  ${({ theme }) => theme.Font.Text.l.Regular};
  margin-left: 8px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

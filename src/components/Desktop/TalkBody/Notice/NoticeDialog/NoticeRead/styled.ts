import { styled, DialogHeader, DialogContent, Mui } from '@wapl/ui';

export const Header = styled(DialogHeader)`` as any;

export const Content = styled(DialogContent)`
  height: 100%;

  ::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const NoticeHeaderWrapper = styled('div')`
  padding: 15px 0;
  display: flex;
`;

export const NoticeDetailText = styled('div')`
  word-break: break-all;
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
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

export const IconButton = styled(Mui.IconButton)<{
  focused?: boolean;
}>`
  width: 24px;
  height: 24px;
  padding: 0px;
  &:hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
  background-color: ${({ focused, theme }) => focused && theme.Color.Black[6]};
`;

export const Menu = styled(Mui.Menu)`
  .MuiPopover-paper {
    width: 160px;
    background: ${({ theme }) => theme.Color.Background[2]};
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  margin-top: 8px;
`;

export const MenuItem = styled(Mui.MenuItem)`
  height: 36px;
`;

export const MenuItemText = styled('span')`
  margin-left: 8px;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

import { ContextMenu, styled } from '@wapl/ui';

export const BottomContextMenu = styled(ContextMenu)`
  z-index: 1350;
  .MuiPaper-root {
    overflow: unset;
  }
`;

export const MenuList = styled('div')`
  padding-top: 16px;
`;

export const MenuItem = styled('div')`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.Color.Gray[900]};
  }
`;

export const MenuItemText = styled('span')`
  ${({ theme }) => theme.Font.Text.l.Regular};
  margin-left: 8px;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const ReactionMenuWrapper = styled('div')`
  box-sizing: border-box;
  width: calc(100% - 16px);
  overflow-x: scroll;
  margin: 0 8px;
  display: flex;
  height: 46px;
  position: absolute;
  top: -54px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.Color.Background[2]};
  box-shadow: 0px 0px 20px 3px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  z-index: 1350;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const EmojiList = styled('div')`
  display: flex;
  gap: 22px;
`;

export const EmojiItem = styled('img')`
  width: 30px;
  height: 30px;
`;

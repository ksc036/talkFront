import { styled, Mui } from '@wapl/ui';

export const ReactionButton = styled('button')`
  width: 28px;
  height: 28px;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background-color: unset;
  &:hover {
    background: #0000000a;
  }
  &:active,
  &:focus {
    background: #0000000f;
    & > svg > path {
      fill: #202124;
    }
  }
`;

export const ReactionMenu = styled(Mui.Popover)`
  .MuiPopover-paper {
    display: flex;
    align-items: center;
    padding: 16px;
    background: ${({ theme }) => theme.Color.Background[2]};
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
  }
`;

export const EmojiButton = styled('button')`
  padding: 0;
  border: 0;
  background: transparent;
  width: 20px;
  height: 20px;
`;

export const EmojiList = styled('div')`
  display: grid;
  grid-template-columns: repeat(5, minmax(26px, auto));
  grid-auto-rows: 26px;
  gap: 8px;
`;

export const EmojiItem = styled('div')<{ isMine: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: ${({ isMine, theme }) =>
    isMine ? theme.Color.Black[6] : ''};
  &:hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }
`;

import { styled, Mui } from '@wapl/ui';

export const Wrapper = styled('div')`
  align-items: flex-end;
  display: flex;
  margin-left: 4px;
`;

export const ReactionPopover = styled(Mui.Popover)`
  .MuiPopover-paper {
    width: 360px;
    height: 460px;
    padding: 12px 0px;
    background: ${({ theme }) => theme.Color.Background[2]};
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    overflow-y: hidden;
  }
`;

export const Header = styled('div')`
  padding: 10px 20px;
  background: ${({ theme }) => theme.Color.Background[2]};
  font: ${({ theme }) => theme.Font.Text.l.Bold};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const ReactionTabs = styled(Mui.Tabs)<{ color?: string }>`
  align-items: center;
  height: 44px;
  padding: 0px 4px;
  margin-bottom: 10px;
  .MuiTabs-scrollButtons {
    width: 16px;
    height: 32px;
    border-radius: 8px;
    &:hover {
      background: ${({ theme }) => theme.Color.Black[4]};
    }
    & svg {
      width: 16px;
      height: 16px;
    }
  }
  .MuiTabs-scrollButtons.Mui-disabled {
    opacity: 0.3;
  }
  .MuiTabs-indicator {
    color: ${({ color }) => color};
    background-color: ${({ color }) => color};
  }
`;

export const ReactionTabLabelWrapper = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ReactionTabLabelText = styled('span')`
  margin-left: 6px;
`;

export const ReactionTab = styled(Mui.Tab)<{ color?: string }>`
  margin: 0;
  min-width: 85px;
  min-height: 44px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.Color.Gray[500]};
  padding: 0;
  &.Mui-selected {
    font-weight: 700;
    font-size: 14px;
    line-height: 14px;
    color: ${({ color }) => color};
  }
`;

export const ReactionPanel = styled('div')`
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

export const ReactionRow = styled('div')`
  height: 52px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
`;

export const ReactionNameText = styled('span')`
  margin-left: 12px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  flex: 1 1 0%;
`;

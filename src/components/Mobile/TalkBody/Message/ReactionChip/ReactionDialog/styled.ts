import { Mui, styled } from '@wapl/ui';

export const ReactionTabs = styled(Mui.Tabs)<{ color?: string }>`
  align-items: center;
  height: 44px;

  .MuiTabs-scrollButtons {
    width: 16px;
    height: 32px;
    border-radius: 8px;
    &:hover {
      background: ${({ theme }) => theme.Color.Black[4]};
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
  margin-left: 8px;
`;

export const ReactionTab = styled(Mui.Tab)<{ color?: string }>`
  margin: 0;
  min-width: 60px;
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

export const ReactionRow = styled('div')`
  height: 56px;
  padding: 16px;
  display: flex;
  align-items: center;
`;

export const ReactionNameText = styled('span')`
  margin-left: 12px;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  flex: 1 1 0%;
`;

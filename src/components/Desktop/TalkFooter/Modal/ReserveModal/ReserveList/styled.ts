import { Mui, styled, Tab, TabPanel, Tabs } from '@wapl/ui';

export const ReserveItemListWrapper = styled(`div`)`
  padding: 0;
  margin: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
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

export const StyledTabs = styled(Tabs)`
  display: flex;
  overflow: unset;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  & .MuiTabs-flexContainer {
    justify-content: space-between;
    & div:first-of-type {
      margin-left: 0px;
    }
    & div {
      width: 50%;
    }
  }
`;

export const StyledTab = styled(Tab)`
  span {
    color: ${({ color }) => color};
    ${({ theme: { Font } }) => Font.Text.m.Bold};
  }
`;

export const ReserveTabPanel = styled(TabPanel)`
  height: 542px;
  padding-top: 12px;
`;

export const ReserveCountWrapper = styled('div')`
  padding: 7px 20px 6px;
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[600]};
`;

export const FloatingButton = styled(Mui.Fab)`
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  height: 48px;
  width: 48px;
  bottom: 20px;
  right: 20px;
  position: absolute;
`;

import { Tabs, Mui, styled, TabPanel, AppBar } from '@wapl/ui';
export const VotingTabPanel = styled(TabPanel)`
  height: calc(100% - 137px);
  position: unset;
  background-color: ${({ theme: { Color } }) => Color.Background[0]};
`;
export const VotingItemListWrapper = styled('ul')`
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  ::-webkit-scrollbar {
    width: 4px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: none;
    border-radius: 4px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const StyledHeader = styled(AppBar)`
  width: auto;
  background-color: ${({ theme: { Color } }) => Color.Background[0]};
`;

export const StyledTabs = styled(Tabs)`
  display: flex;
  overflow: visible;
  & .MuiTabs-flexContainer {
    height: 48px;
    justify-content: space-between;
    & div:first-of-type {
      margin-left: 0px;
    }
    & div {
      width: 50%;
    }
  }
`;

export const VoteCountWrapper = styled('div')`
  padding: 7px 20px 6px;
  span {
    ${({ theme: { Font } }) => Font.Text.xs.Regular};
    color: ${({ theme: { Color } }) => Color.Gray[600]};
    & + span {
      margin-left: 4px;
      color: ${({ theme: { Color } }) => Color.Gray[800]};
    }
  }
`;

export const StyleFab = styled(Mui.Fab)`
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  height: 48px;
  width: 48px;
  bottom: 16px;
  right: 16px;
  position: absolute;
`;

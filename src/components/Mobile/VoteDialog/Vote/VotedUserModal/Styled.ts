import { Tabs, AppBar, styled, TabPanel } from '@wapl/ui';

export const DialogWrapper = styled('div')`
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: ${({ theme: { Color } }) => Color.Background[0]};
`;

export const StyledHeader = styled(AppBar)`
  width: auto;
`;

export const VotingTabPanel = styled(TabPanel)`
  overflow: auto;
  height: calc(100% - 140px);
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

export const StyledTabs = styled(Tabs)`
  display: flex;
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

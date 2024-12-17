import { Tabs, Dialog, styled, TabPanel } from '@wapl/ui';

export const StyledDialog = styled(Dialog)`
  left: 50%;
  top: 50%;
  height: 600px;
  transform: translate(calc(-50% + 430px), calc(-50% - 40px));
  .MuiDialog-paper {
    height: 100%;
  }
  .MuiDialog-paperScrollPaper {
    height: 100%;
  }
`;

export const DialogWrapper = styled('div')`
  display: flex;
  height: 600px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const DialogHeaderWrapper = styled('div')<{ indicatorColor?: string }>`
  width: 360px;
  border-radius: 12px;
  position: fixed;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  z-index: 100;

  .MuiTabs-indicator {
    background-color: ${({ indicatorColor }) => `${indicatorColor}`};
  }
`;

export const VotingTabPanel = styled(TabPanel)`
  height: calc(100% - 140px);
  overflow: auto;
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
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

import { Tabs, Mui, styled, TabPanel } from '@wapl/ui';
export const VotingTabPanel = styled(TabPanel)`
  height: calc(100% - 173px);
  padding-top: 12px;
`;
export const VotingItemListWrapper = styled('ul')`
  padding: 0;
  margin: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: 453px;
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

export const RoomInfoWrapper = styled('div')`
  display: flex;
  padding: 0 20px;
  height: 40px;
  margin-bottom: 12px;
  align-items: center;
`;

export const RoomTitle = styled('div')`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  margin-left: 12px;
  align-items: center;
  color: ${({ theme }) => theme.Color.Gray[900]};
  width: 268px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

export const StyleFab = styled(Mui.Fab)`
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  height: 48px;
  width: 48px;
  bottom: 20px;
  right: 20px;
  position: absolute;
`;

export const EmptyVoteWrapper = styled('div')`
  height: calc(100% - 32px);
`;

import { Checkbox, ContextMenu, Tab, Tabs, styled } from '@wapl/ui';

export const BottomContextMenu = styled(ContextMenu)`
  z-index: 1350;
  .MuiPaper-root {
    overflow: unset;
  }
`;

export const DeliverBody = styled('div')`
  padding: 0 16px 16px;
`;

export const DeliverTabs = styled(Tabs)`
  display: flex;
  align-items: flex-start;
  height: 40px;

  & .MuiTabs-flexContainer {
    padding: 0;
    justify-content: flex-start;
    > div {
      width: 100% !important;
      :first-of-type {
        margin-left: 0px;
      }

      > button {
        width: 100% !important;
      }
    }
  }

  .MuiTabs-indicator {
    border-radius: 6px;
    background-color: ${({ theme }) => theme.Color.Blue[500]};
  }
`;

export const DeliverTab = styled(Tab)`
  font-family: 'Spoqa Han Sans Neo';
  font-weight: 700;
  font-size: 30px;
  line-height: 18px;
  &.Mui-selected {
    color: ${({ theme }) => theme.Color.Blue[500]};
  }

  &.MuiTab-root {
    min-width: inherit;
    margin: 0;
  }
`;

export const ButtonWrapper = styled('div')`
  width: 100%;
  display: flex;
  bottom: 0;
  margin: 0px auto;
  box-sizing: border-box;
`;

export const DeleteIconButton = styled('button')`
  outline: 0;
  border: 0;
  background: transparent;
  padding: 0;
  position: absolute;
  z-index: 10;
`;

export const ChipItemWrapper = styled('div')`
  display: flex;
  overflow-x: auto;
`;

export const ChipItem = styled('div')`
  position: relative;
  padding: 10px 0;
  height: 56px;
  cursor: pointer;
`;

export const ChipItemContent = styled('div')`
  overflow: hidden;
  flex: 1;
  align-items: center;
  cursor: pointer;
`;

export const ChipItemInfo = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

export const ChipItemCheckbox = styled(Checkbox, {
  shouldForwardProp: (props) => props !== 'checkboxColor',
})<{ checkboxColor?: string }>`
  &.Mui-checked {
    background-color: ${(props) => props.checkboxColor};
  }
  &.Mui-disabled {
    background-color: ${({ theme: { Color } }) => Color.Gray[400]} !important;
    svg {
      display: none;
    }
  }
`;

export const PersonaName = styled('span')`
  max-width: 190px;
  overflow-x: hidden;
  overflow-y: clip;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-size: 14px;
  line-height: 18px;
  font-weight: 400;
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;

export const PersonaSub = styled('span')`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme: { Color } }) => Color.Gray[600]};
`;

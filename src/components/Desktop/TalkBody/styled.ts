import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  width: 100%;
  background: ${(props) => props.color};
  position: relative;

  .virtuosoArea::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  .virtuosoArea::-webkit-scrollbar-track,
  .virtuosoArea::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  .virtuosoArea::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const ScrollDownButton = styled('button')`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 48px;
  height: 48px;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  z-index: 1000;
  &,
  &:hover,
  &:focus,
  &:active {
    filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.2));
  }
  &:hover {
    & > div > svg > path {
      fill: #f5f5f5;
    }
  }
  &:focus {
    & > div > svg > path {
      fill: #f0f0f0;
    }
  }
  &:active {
    & > div > svg > path {
      fill: #e5e5e5 !important;
    }
  }
`;

export const ScrollToReplyButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 6px;
  border: none;
  border-radius: 47px;
  background: rgba(255, 255, 255, 0.9);
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ color }) => color};
  gap: 8px;
  box-sizing: border-box;
  padding: 9px 16px;
  cursor: pointer;
`;

export const ScrollToNewMsgButton = styled('button')`
  width: calc(100% - 40px);
  height: 48px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border: 0;
  cursor: pointer;
  border-radius: 8px;
`;

export const BottomButtonsWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: absolute;
  bottom: 20px;
  width: 100%;
  align-items: center;
`;

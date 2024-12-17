import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  height: 100%;
  position: relative;
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
  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.2));
  cursor: pointer;
  &:hover {
    background: none;
  }
`;

export const ScrollToReplyButton = styled('button')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  bottom: 20px;
  border: none;
  border-radius: 47px;
  background: rgba(255, 255, 255, 0.9);
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ color }) => color};
  gap: 8px;
  box-sizing: border-box;
  padding: 9px 16px;
`;

export const ScrollToNewMsgButton = styled('button')`
  position: absolute;
  bottom: 12px;
  left: 8px;
  width: calc(100% - 16px);
  height: 42px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border: 0;
  cursor: pointer;
  border-radius: 8px;
  &:hover {
  }
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

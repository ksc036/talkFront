import { styled } from '@wapl/ui';

export const Overlay = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MediaHeader = styled('div')`
  width: 100%;
  height: 80px;
  position: absolute;
  top: 0px;
  left: 0px;
  padding-left: 40px;
  padding-right: 40px;
  display: grid;
  grid-template-columns: fit-content(100%) 1fr fit-content(100%) fit-content(
      100%
    );
  align-items: center;
  z-index: 1000;
`;

export const MediaName = styled('span')`
  ${({ theme: { Font } }) => Font.Text.xl.Medium};
  font-weight: 500;
  color: ${({ theme: { Color } }) => Color.White[100]};
  line-height: 25px;
  margin-left: 12px;
`;

export const MediaButtonsWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

export const MediaButton = styled('button')`
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  padding: 0px;
  margin: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  :disabled {
    opacity: 0.5;
  }
`;

export const MediaContent = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

import { styled } from '@wapl/ui';

export const Overlay = styled('div')`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.Color.Black[100]};
  z-index: 1000;
  display: grid;
  grid-template-rows: 56px 1fr 44px;
  align-items: center;
  justify-content: center;
`;

export const MediaHeader = styled('div')`
  width: 100vw;
  height: 56px;
  padding: 0px 16px;
  display: grid;
  grid-template-columns: fit-content(100%) 1fr fit-content(100%);
  align-items: center;
  gap: 12px;
  background-color: ${({ theme }) => theme.Color.Black[70]};
`;

export const MediaHeaderButton = styled('button')`
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
export const MediaHeaderInfoWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.Color.White[100]};
`;

export const UploaderName = styled('span')`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
`;

export const UploadedDate = styled('span')`
  ${({ theme: { Font } }) => Font.Text.xxs.Regular};
`;

export const MediaContent = styled('div')`
  width: 100vw;
  height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MediaFooter = styled('div')`
  width: 100vw;
  height: 44px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

export const MediaFooterButton = styled('button')`
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

export const MediaInfoWrapper = styled('div')`
  width: calc(100vw - 32px);
  height: 108px;
  background-color: ${({ theme }) => theme.Color.Black[50]};
  border-radius: 16px;
  padding: 16px;
  position: absolute;
  bottom: 60px;
  left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;
`;

export const MediaInfoElementsWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const MediaInfoLabel = styled('label')`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  width: 60px;
  color: ${({ theme: { Color } }) => Color.Gray[500]};
`;

export const MediaInfoValue = styled('span')`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  color: ${({ theme: { Color } }) => Color.White[100]};
`;

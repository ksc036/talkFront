import { styled } from '@wapl/ui';

export const VideoPlayerWrapper = styled('div')`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VideoPlayer = styled('video')`
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  border-radius: 8px;
`;

export const PlayButtonWrapper = styled('div')`
  width: 100px;
  height: 100px;
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
  cursor: pointer;

  &:hover {
    svg > g > circle {
      fill: rgba(0, 0, 0, 0.4);
    }
  }
`;

export const VideoInfoWrapper = styled('div')`
  width: 240px;
  height: 160px;
  background-color: ${({ theme: { Color } }) => Color.Black[80]};
  border-radius: 10px;
  padding: 24px;
  position: absolute;
  top: calc(50% - 80px);
  left: calc(50% - 120px);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;
`;

export const VideoInfoElementsWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

export const VideoInfoLabel = styled('label')`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  width: 60px;
  color: ${({ theme: { Color } }) => Color.Gray[500]};
`;

export const VideoInfoValue = styled('span')`
  ${({ theme: { Font } }) => Font.Text.l.Regular};
  color: ${({ theme: { Color } }) => Color.White[100]};
`;

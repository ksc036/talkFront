import { styled } from '@wapl/ui';

export const VideoPlayerWrapper = styled('div')`
  width: 100%;
  height: calc(100vh - 100px);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const VideoPlayer = styled('video')`
  width: 100%;
  height: calc(100vh - 100px);
  object-fit: contain;
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

import { styled } from '@wapl/ui';

type TalkContainerProps = {
  width?: number;
  height?: number;
};

export const TalkContainer = styled('div')<TalkContainerProps>`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  min-width: 350px;
  max-width: ${({ width }) => (width ? `${width}px` : '100%')};
  position: relative;
`;

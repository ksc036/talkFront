import { styled } from '@wapl/ui';

export const InfiniteScrollLoopWrapper = styled.div`
  position: relative;
  width: 60px;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // background: linear-gradient(#fff 0%, rgba(255, 255, 255, 0) calc(15%), rgba(255, 255, 255, 0) calc(85%), #fff 100%);
    pointer-events: none;
  }
`;

export const LoopContents = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'height',
})<{
  height: number;
}>`
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  height: ${({ height }) => `${height}px`}; // TimePicker height
`;

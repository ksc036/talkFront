import { useRef, useState, useCallback, useLayoutEffect } from 'react';

import {
  InfiniteScrollLoopWrapper,
  LoopContents,
} from './InfiniteScrollLoop.style';

interface Props {
  visibleHeight: number;
  surroundingBackup?: number;
  scrollTopValue?: string;
}

const InfiniteScrollLoop = ({
  visibleHeight,
  surroundingBackup = 2,
  scrollTopValue,
  children,
}: React.PropsWithChildren<Props>) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const backupHeight = contentHeight * surroundingBackup;

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    if (scrollTop < backupHeight || scrollTop >= backupHeight + contentHeight) {
      scrollRef.current.scrollTop = backupHeight + (scrollTop % contentHeight);
    }
  }, [contentHeight, backupHeight]);

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.offsetHeight);
    const scrollTop = Array.from(
      contentRef.current.querySelectorAll('div'),
    ).find((el) => el.textContent === scrollTopValue)?.offsetTop;
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollTop || contentRef.current.offsetHeight * surroundingBackup;
    }
  }, [surroundingBackup]);

  return (
    <InfiniteScrollLoopWrapper>
      <LoopContents
        ref={scrollRef}
        height={visibleHeight}
        onScroll={handleScroll}
      >
        {[...Array(surroundingBackup)].map((_, index) => (
          <div key={index}>{children}</div>
        ))}
        <div ref={contentRef}>{children}</div>
        {[...Array(surroundingBackup)].map((_, index) => (
          <div key={index}>{children}</div>
        ))}
      </LoopContents>
    </InfiniteScrollLoopWrapper>
  );
};

export default InfiniteScrollLoop;

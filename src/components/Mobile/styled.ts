import { styled } from '@wapl/ui';

export const TalkLayout = styled.div<{ color?: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ color }) => color};
`;

export const LoadingBar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

export const LoadingImage = styled.img`
  width: 40px;
  height: 40px;
`;

export const Header = styled.div<{ headerVisible?: boolean }>`
  justify-content: center;
  display: ${({ headerVisible }) => !headerVisible && 'none'};
`;

export const Body = styled.div`
  height: 100%;
  overflow: hidden;
`;

export const Footer = styled.div``;

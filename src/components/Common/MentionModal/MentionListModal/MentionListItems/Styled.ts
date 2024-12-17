import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  width: 344px;
  min-height: 52px;
  max-height: 274px;
  box-sizing: border-box;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const WrapperMobile = styled.div`
  position: fixed;
  bottom: 52px;
  width: ${window.innerWidth}px;
  min-height: 56px;
  max-height: 198px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: ${({ theme: { Color } }) => Color.White[100]};
  box-shadow: inset 0 -6px 6px -6px rgba(0, 0, 0, 0.3);

  ::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

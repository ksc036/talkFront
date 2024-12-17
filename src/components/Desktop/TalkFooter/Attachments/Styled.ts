import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  border-top: 1px solid ${({ theme }) => theme.Color.Gray[200]};
  padding: 16px 20px;
  overflow: auto;
  white-space: nowrap;
  display: flex;
  align-items: center;
  position: relative;
  background: ${({ theme }) => theme.Color.White[100]};
  gap: 16px;

  ::-webkit-scrollbar {
    height: 12px;
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

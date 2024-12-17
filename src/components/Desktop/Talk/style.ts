import { styled } from '@wapl/ui';

export const TalkLayout = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: transparent;
  & > svg {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  & > img {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const LoadingImage = styled.img`
  width: 40px;
  height: 40px;
`;

export const LoadingBar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: ${({ theme }) => theme.Color.Gray[200]};
`;

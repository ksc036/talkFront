import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  // max-height: 230px;
  width: 100vw;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(4, fit-content(100%));
  justify-content: space-evenly;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  padding-top: 40px;
  padding-bottom: 40px;
  gap: 20px 0px;
`;

export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${({ theme }) => theme.Color.Gray[900]};
  gap: 14px;
`;

export const IconBox = styled.button<{ backgroundColor: string }>`
  width: 52px;
  height: 52px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 20px;
  border: 0;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.strong`
  ${({ theme }) => theme.Font.Text.xs.Regular};
`;

export const SquircleWrapper = styled('div')``;

export const ItemInput = styled.input`
  width: 52px;
  height: 52px;
  position: absolute;
  top: 0px;
  left: 0px;
  opacity: 0;
`;

export const AlbumIconwrapper = styled('div')`
  svg > g > path:nth-of-type(2) {
    fill: rgba(249, 181, 80, 1);
  }
`;

export const FileIconwrapper = styled('div')`
  svg > path {
    fill: rgba(59, 193, 169, 1);
  }
`;

export const NoticeIconWrapper = styled('div')`
  svg > path {
    fill: rgba(114, 135, 177, 1);
  }
`;

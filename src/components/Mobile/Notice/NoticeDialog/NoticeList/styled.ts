import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  height: 100%;
`;

export const NoticeHeader = styled('div')`
  height: 56px;
`;

export const NoticeBody = styled('div')`
  background-color: ${({ theme }) => theme.Color.Background[0]};
  height: calc(100% - 56px);
`;

export const NoticeList = styled('div')`
  overflow: auto;
  overflow-y: scroll;

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

export const NoticeItemWrapper = styled('div')`
  padding: 11px 16px 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
  &:active {
    background: rgba(0, 0, 0, 0.06);
  }
  & svg {
    align-self: start;
    margin-top: 3px;
  }
`;

export const NoticeItem = styled('div')`
  flex: 1 1 0%;
`;

export const NameText = styled('span')`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const TimeText = styled('span')`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  margin-left: 4px;
`;

export const ContentText = styled('div')`
  ${({ theme }) => theme.Font.Text.l.Regular};
  line-height: 26px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  margin-bottom: 6px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const AddButton = styled('button')`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  background: none;
  border: 0;
  filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.2));
  &:hover {
    background: none;
  }
`;

export const ImgWrapper = styled('div')`
  text-align: center;
`;

export const NoticeEmpty = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const ButtonWrapper = styled('div')`
  width: 100%;
  display: flex;
  position: absolute;
  bottom: 0;
  margin: 0px auto;
  padding: 0px 16px 16px;
  box-sizing: border-box;
  button {
    flex: 1;
  }
`;

import { styled } from '@wapl/ui';

import { ButtonReset } from '@/styles/common';

type RoomMemberCountProps = {
  color: string;
};

export const TalkHeader = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  width: 100%;
  height: 56px;
  background: ${({ color }) => color};
`;

export const TalkContentsWrapper = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px 0px 16px;
  width: 100%;
  background: ${({ color }) => color};
`;

export const TalkLeftContentsWrapper = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  height: 100%;
  background: ${({ color }) => color};
`;

export const TalkRightContentsWrapper = styled.div<{ color?: string }>`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  height: 100%;
  background: ${({ color }) => color};
`;

export const Divider = styled.div<{ color?: string }>`
  height: 1px;
  background: ${({ color }) => color};
`;

export const RoomTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  gap: 4px;
`;
export const RoomTitle = styled.h2`
  width: fit-content;
  max-width: calc(100vw - 160px);
  font-family: 'Spoqa Han Sans Neo';
  font-size: 18px;
  font-weight: 500;
  height: 24px;
  line-height: 24px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

export const RoomMemberCount = styled('p')<RoomMemberCountProps>`
  font-family: 'Spoqa Han Sans Neo';
  font-size: 18px;
  font-weight: 500;
  height: 24px;
  line-height: 24px;
  color: ${({ color }) => color};
  margin-left: 4px;
`;

export const IconButton = styled(`button`)`
  ${ButtonReset}
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  :hover {
    background: ${({ theme }) => theme.Color.Gray[100]};
    border-radius: '50%';
  }
`;

export const SearchNum = styled('span')<{ color?: string }>`
  margin-right: 8px;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  & > span {
    color: ${({ color }) => color};
  }
`;

export const NoSearchResult = styled('span')`
  margin-right: 8px;
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme: { Color } }) => Color.Gray[900]};
`;

export const IconBtn = styled('button')`
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 0;
  background: none;
  flex-shrink: 0;
  & + & {
    margin-left: 0;
  }
  & > svg {
    flex-shrink: 0;
  }
  &:disabled {
    & > svg {
      path {
        fill: ${({ theme: { Color } }) => Color.Gray[400]};
      }
    }
  }
  &:hover:not(:disabled) {
    background-color: ${({ theme: { Color } }) => Color.Black[4]};
  }
  &:active:not(:disabled) {
    background-color: ${({ theme: { Color } }) => Color.Black[6]};
    & > svg {
      path {
        fill: ${({ theme: { Color } }) => Color.Gray[900]};
      }
    }
  }
`;

export const SearchBarWrapper = styled('div')<{
  backGroundColor?: string;
  borderColor?: string;
}>`
  .MuiFilledInput-input {
    font-family: 'Spoqa Han Sans Neo';
    font-size: 14px !important;
    height: 18px !important;
    line-height: 18px !important;
    color: ${({ theme }) => theme.Color.Gray[900]};

    &::placeholder {
      font-family: 'Spoqa Han Sans Neo';
      font-size: 14px !important;
      height: 18px !important;
      line-height: 18px !important;
      color: ${({ theme }) => theme.Color.Gray[700]};
    }
  }

  .MuiFilledInput-root.MuiInputBase-root {
    background-color: ${({ backGroundColor }) => backGroundColor};
    outline: ${({ borderColor }) => `1px solid ${borderColor}`};
    border-radius: 8px;

    ::after {
      border: none;
    }
  }

  .MuiFilledInput-root:hover,
  .MuiInputBase-root.MuiInputBase-root.Mui-focused {
    background-color: ${({ theme }) => theme.Color.Background[0]};
    outline: ${({ borderColor }) =>
      borderColor ? `2px solid ${borderColor}` : 'none'};

    ::after {
      border: none;
    }
  }
`;

// TODO: Props로 active 등을 받아서 color 설정할 수 있나 알아보기
export const CancelWrapperActive = styled('span')`
  width: 34px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: ${({ theme: { Color } }) => Color.Gray[900]};
  margin-right: 0px;
`;

export const CancelWrapper = styled('span')`
  width: 34px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: ${({ theme: { Color } }) => Color.Gray[500]};
  margin-right: 0px;
`;

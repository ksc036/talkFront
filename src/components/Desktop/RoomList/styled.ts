import { styled } from '@wapl/ui';

export const RoomListWrapper = styled('section')`
  width: 100%;
  height: 100%;
  border-right: 1px solid ${({ theme }) => theme.Color.Gray[200]};

  // 접힙/펼침 버튼
  :nth-of-type(1) > div:nth-of-type(1) > button:nth-of-type(1) {
    z-index: 10;
  }

  // LNB 상단 영역 > 텍스트
  section > header:nth-of-type(1) > div:nth-of-type(1) > h2 {
    ${({ theme }) => theme.Font.Text.xl.Medium};
    font-weight: 500;
  }

  section > div {
    width: 100%;
    max-height: calc(100vh - 228px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  section > div > section {
    width: 100%;
  }
`;

export const RoomListHeaderWrapper = styled('header')`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
`;

export const RoomListHeaderTitle = styled('h1')`
  ${({ theme }) => theme.Font.Text.xl.Medium};
  font-weight: 500;
`;

export const RoomListHeaderButtonList = styled('ul')`
  height: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const RoomListHeaderButton = styled('button')`
  width: 32px;
  height: 32px;
  margin: -4px;
  padding: 0px;
  border: 0px;
  border-radius: 28px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export const RoomListHeaderIcon = styled('img')`
  width: 24px;
  height: 24px;
`;

export const RoomListEkrWrapper = styled('div')``;

export const RoomListSenWrapper = styled('div')`
  .MuiTab-fullWidth {
    padding: 0px;
  }

  .MuiPaper-root-MuiPopover-paper {
    background-color: red;
  }
`;

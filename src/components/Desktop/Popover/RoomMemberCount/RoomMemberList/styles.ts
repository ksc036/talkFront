import { styled } from '@wapl/ui';

export const RoomInfoMenuItem = styled('li')`
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  cursor: pointer;
  :hover {
    background: ${({ theme }) => theme.Color.Gray[100]};
  }

  &:nth-of-type(1) {
    margin-top: 12px;
  }
`;

export const RoomUserInfo = styled('div')`
  width: 100%;
  margin-left: 12px;
  display: grid;
  align-items: center;
  grid-template-columns: fit-content(100%) 1fr;
  gap: 4px;
`;

export const RoomUserName = styled('span')`
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

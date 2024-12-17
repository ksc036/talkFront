import { styled } from '@wapl/ui';

type RoomMenuTextProps = {
  color?: string;
};

export const RoomMenuText = styled('span')<RoomMenuTextProps>`
  display: flex;
  align-items: center;
  width: 280px;
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

export const JoinLinkCopyWrapper = styled('li')`
  height: 52px;
  display: flex;
  gap: 12px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  background-color: ${({ theme }) => theme.Color.Background[2]};
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.Color.Gray[100]};
  }
`;

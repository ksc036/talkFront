import { styled } from '@wapl/ui';

export const MemberIcon = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 14px;
`;

export const RoomMenuText = styled('span')`
  display: flex;
  align-items: center;
  width: 280px;
  font-family: 'Spoqa Han Sans Neo';
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
`;

// TODO: margin-left -20px 줘도 되냐고 현철님께 문의하기
export const MemberItemWrapper = styled('li')`
  height: 52px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  background-color: transparent;
  cursor: pointer;
  :hover {
    background-color: ${({ theme }) => theme.Color.Gray[100]};
  }
`;

export const IconWrapper = styled('div')`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

import { styled } from '@wapl/ui';

export const CopyIcon = styled('div')`
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
  color: #067dfd;
`;

export const Wrapper = styled('li')`
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 0 0 0;
  margin: 0 10px 0 10px;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  background-color: ${({ theme }) => theme.Color.Background[0]};
  cursor: pointer;
`;

import { styled } from '@wapl/ui';

export const RoomInfoMenuItemWrapper = styled('ul')<{
  hasInviteButton?: boolean;
}>`
  width: 260px;
  height: ${({ hasInviteButton }) => (hasInviteButton ? '220px' : '272px')};
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0;
  padding: 0;

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

export const InviteButton = styled('span')`
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: 'Spoqa Han Sans Neo';
  border-top: 1px solid;
  border-color: ${({ theme }) => theme.Color.Gray[200]};
  cursor: pointer;

  :hover {
    background: ${({ theme }) => theme.Color.Gray[200]};
  }
`;

export const InviteText = styled('span')`
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  height: 20px;
  line-height: 20px;
  color: #5558c9;
`;

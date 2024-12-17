import { alpha } from '@mui/system';
import { styled } from '@wapl/ui';

export const ReserveListItemsWrapper = styled(`div`)<{ colorEffect: string }>`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.Font.Text.m.Regular};
  gap: 8px;
  padding: 20px;
  max-height: 126px;

  &:hover {
    background-color: ${({ colorEffect }) => alpha(colorEffect, 0.06)};
    cursor: pointer;
  }
  &:active {
    background-color: ${({ colorEffect }) => alpha(colorEffect, 0.1)};
    cursor: pointer;
  }
`;

export const ReserveContent = styled(`div`)`
  ${({ theme }) => theme.Font.Text.m.Regular};
  max-height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ReserveDate = styled(`div`)`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const ReserveRoomWrapper = styled(`div`)`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const ReserveRoomName = styled(`div`)`
  ${({ theme }) => theme.Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[700]};
`;

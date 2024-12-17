import { styled } from '@wapl/ui';

export const ReservedRoomWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  ${({ theme }) => theme.Font.Text.m.Regular};
  gap: 12px;
  align-items: center;
  padding: 6px 0px 8px 0px;
  margin: 0 20px;
  border-bottom: 1px solid #e8eaed;
  height: 52px;
`;

export const ReserveContentWrapper = styled(`div`)`
  height: 400px;
  margin: 0 20px 8px 20px;
  padding: 16px 0;
  border-bottom: 1px solid #e8eaed;
  ${({ theme }) => theme.Font.Text.m.Regular};
`;

export const ReserveDetailWrapper = styled(`div`)`
  display: flex;
  felx-direction: column;
  height: 44px;
  margin: 0 20px;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.Font.Text.m.Regular};
`;

export const ReserveDetailLable = styled(`div`)`
  color: #80868b;
`;

export const FooterButtonWrapper = styled(`div`)`
  display: flex;
  felx-direction: column;
  gap: 10px;
  button {
    flex: 1;
  }
  padding: 24px 70px 20px 70px;
`;

import { AppBar, styled } from '@wapl/ui';

export const StyledHeader = styled(AppBar)`
  width: auto;
  background-color: ${({ theme: { Color } }) => Color.Background[0]};
`;

export const ReservedRoomWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  ${({ theme }) => theme.Font.Text.l.Regular};
  gap: 12px;
  align-items: center;
  padding: 6px 0px 8px 0px;
  margin: 0 20px;
  height: 56px;
`;

export const ReserveContentWrapper = styled(`div`)`
  height: calc(100% - 316px);
  margin: 0 20px 8px 20px;
  padding: 16px 0;
  ${({ theme }) => theme.Font.Text.l.Regular};
`;

export const ReserveDetailWrapper = styled(`div`)`
  display: flex;
  felx-direction: column;
  height: 48px;
  margin: 0 20px;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.Font.Text.l.Regular};
`;

export const ReserveDetailLable = styled(`div`)`
  color: #80868b;
`;

export const FooterButtonWrapper = styled(`div`)`
  display: flex;
  height: 80px;
  gap: 8px;
  padding: 16px 20px;
  flex-direction: row;
  button {
    flex: 1;
  }
`;

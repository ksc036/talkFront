import { styled, Button } from '@wapl/ui';

export const ButtonWrapper = styled('div')`
  display: flex;
  width: 100%;
  justify-content: center;
  text-align: center;
  padding: 8px 16px 16px 16px;
  gap: 8px;
  button {
    flex: 1;
  }
`;

export const VoteButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 328px;
  height: 48px;
  ${({ theme }) => theme.Font.Text.l.Regular};
`;

export const VoteButtons = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 164px;
  height: 48px;
  ${({ theme }) => theme.Font.Text.l.Regular};
  margin-left: 12px;
  &:first-of-type {
    margin-left: 0;
  }
`;

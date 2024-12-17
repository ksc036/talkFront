import { styled, Button } from '@wapl/ui';

export const ButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 0 0 20px;
  margin-top: auto;
`;

export const StyledButton = styled(Button)`
  min-width: 154px;
  margin-right: 12px;
  font-size: 13px;
  &: last-of-type {
    margin-right: 0;
  }
`;

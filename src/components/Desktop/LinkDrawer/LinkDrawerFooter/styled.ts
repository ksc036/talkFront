import { styled } from '@wapl/ui';

type CancelSelectedButtonProps = {
  textColor?: string;
};

export const LinkDrawerFooterWrapper = styled('div')`
  width: 100%;
  height: 58px;
  padding-left: 20px;
  padding-right: 20px;
  display: grid;
  grid-template-columns: fit-content(100%) 1fr fit-content(100%);
  align-items: center;
  background-color: ${({ theme }) => theme.Color.Gray[50]};
  border-top: ${({ theme }) => `1px solid ${theme.Color.Gray[200]}`};
`;

export const CheckedLinksNumberText = styled('p')`
  ${({ theme: { Font } }) => Font.Text.m.Medium};
`;

export const UncheckAllButton = styled('button')<CancelSelectedButtonProps>`
  width: fit-content;
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ textColor }) => `${textColor}`};
  background-color: transparent;
  border: none;
  padding: 0px;
  display: flex;
  align-items: center;
  margin-left: 8px;
  cursor: pointer;

  :disabled {
    color: ${({ theme }) => theme.Color.Gray[500]};
    cursor: default;
  }
`;

export const IconWrapper = styled('button')`
  width: 20px;
  height: 20px;
  background-color: transparent;
  border: none;
  padding: 0px;
  cursor: pointer;

  :disabled {
    cursor: default;
  }
`;

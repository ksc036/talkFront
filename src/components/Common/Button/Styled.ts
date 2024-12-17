import { styled, Button } from '@wapl/ui';

export const ButtonWrapper = styled.button`
  padding: 0;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const StyledCommonButton = styled(Button)<{
  color?: string;
  disabled: boolean;
}>`
  background-color: ${({ color }) => color};
  cursor: pointer;
  :hover {
    ${({ color, disabled }) =>
      !disabled && `background-color: ${color}; filter: grayscale(4%);`};
  }
  :active {
    ${({ color, disabled }) =>
      !disabled && `background-color: ${color}; filter: grayscale(10%);`};
  }
`;

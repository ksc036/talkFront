import { styled } from '@wapl/ui';

export const StyledButton = styled('button')`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  :hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  :active {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

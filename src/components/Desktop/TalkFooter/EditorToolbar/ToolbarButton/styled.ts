import { styled } from '@wapl/ui';

export const ButtonWrapper = styled.button<{
  isActive: boolean;
  color: string;
}>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: none;
  border: 0;
  padding: 0;
  margin: 3px;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${({ theme }) => theme.Font.Text.m.Regular};
  background-color: ${({ isActive, color }) =>
    isActive ? `${color}1a` : 'none'};
`;

import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.Color.Gray[100]};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.Color.Gray[300]};
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.Color.Gray[500]};
  ${({ theme }) => theme.Font.Text.s.Regular};
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &:hover {
    opacity: 0.65;
  }
`;

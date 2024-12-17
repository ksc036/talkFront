import { styled } from '@wapl/ui';

export const Wrapper = styled.button`
  margin-left: auto;
  margin-bottom: auto;
  padding: 0;
  border: 0;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.Color.White[100]};
`;

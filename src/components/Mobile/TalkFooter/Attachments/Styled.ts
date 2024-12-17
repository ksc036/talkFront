import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  border-top: 1px solid #dadce0;
  padding: 15px;
  overflow: auto;
  white-space: nowrap;
  display: flex;
  align-items: center;
  position: relative;
  background: ${({ theme }) => theme.Color.White[100]};
`;

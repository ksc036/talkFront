import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 32px;
  padding: 0 16px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.Color.Gray[200]};
  .mention {
    color: #1890ff;
    padding: 2px 4px;
    border-radius: 3px;
    display: inline-block;
    cursor: pointer;
    font-weight: 800;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 14px;
  background-color: ${({ theme }) => theme.Color.Gray[300]};
  margin: 0 8px;
`;

import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  display: flex;
  flex: 1;
  height: 52px;
  padding: 8px 20px;
  box-sizing: border-box;
  align-items: center;
  flex-direction: row;
  :hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
    cursor: pointer;
  }
  :active {
    background-color: ${({ theme }) => theme.Color.Black[6]};
    cursor: pointer;
  }
`;

export const MentionName = styled.div`
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-family: Spoqa Han Sans Neo;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: ${({ theme }) => theme.Color.Gray[900]};
  margin-left: 12px;
  & svg {
    margin-right: 4px;
  }
`;

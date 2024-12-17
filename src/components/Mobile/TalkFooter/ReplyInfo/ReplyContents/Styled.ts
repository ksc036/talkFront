import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
`;

export const ReplyTitle = styled('div')`
  ${({ theme }) => theme.Font.Text.m.Medium};
  margin-bottom: 8px;
`;

export const ReplyName = styled('div')`
  color: ${(props) => props.color};
  font-weight: 500;
  span {
    color: ${(props) => (props.color === '#FB4516' ? props.color : '#202124')};
    font-weight: ${(props) => (props.color === '#FB4516' ? 500 : 400)};
  }
`;

export const ReplyType = styled('div')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
`;

export const ReplyBody = styled('div')`
  ${({ theme }) => theme.Font.Text.m.Regular};
  color: ${(props) => props.color};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

import { styled } from '@wapl/ui';

type LinkCheckBoxWrapperProps = {
  checkedColor?: string;
};

type LinkMoreButtonWrapperProps = {
  focused: boolean;
};

export const LinkItemWrapper = styled('div')`
  width: 240px;
  height: 200px;
  background-color: ${({ theme }) => theme.Color.Gray[50]};
  border: ${({ theme }) => `1px solid ${theme.Color.Gray[200]}`};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.Color.Gray[100]};
  }
`;

export const LinkImage = styled('img')`
  width: 100%;
  height: 113px;
  border-radius: 12px 12px 0px 0px;
  object-fit: cover;
`;

export const LinkNoImage = styled('div')`
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  width: 100%;
  height: 113px;
  border-radius: 12px 12px 0px 0px;
  color: ${({ theme }) => theme.Color.Gray[500]};
  background-color: ${({ theme }) => theme.Color.Gray[200]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const LinkCheckBoxWrapper = styled('div')<LinkCheckBoxWrapperProps>`
  position: absolute;
  top: 16px;
  left: 16px;

  & .MuiCheckbox-root {
    border: ${({ theme }) => `1px solid ${theme.Color.Gray[400]}`};
  }

  & .Mui-checked {
    border: ${({ checkedColor }) => `1px solid ${checkedColor}`};
    background-color: ${({ checkedColor }) => `${checkedColor}`} !important;
  }
`;

export const LinkMoreButtonWrapper = styled('div')<LinkMoreButtonWrapperProps>`
  width: 26px;
  height: 26px;
  border-radius: 13px;
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.Color.Black[4]};
  }

  background-color: ${({ focused, theme }) => focused && theme.Color.Black[6]};
`;

export const LinkInfo = styled('div')`
  width: 240px;
  height: 87px;
  border-radius: 0px 0px 12px 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
`;

export const LinkTitle = styled('div')`
  width: 220px;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LinkDescription = styled('div')`
  width: 220px;
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LinkUrl = styled('div')<{ color?: string }>`
  width: 220px;
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ color }) => `${color}`};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 12px;
`;

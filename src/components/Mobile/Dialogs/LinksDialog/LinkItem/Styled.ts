import { styled } from '@wapl/ui';

export const UrlWrapper = styled('div')`
  width: 156px;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid ${({ theme }) => theme.Color.Gray[200]};
  border-radius: 16px;
`;

export const UrlImage = styled('img')`
  width: 100%;
  height: 84px;
  border-radius: 16px 16px 0px 0px;
  object-fit: cover;
`;

export const NoUrlImage = styled('div')`
  width: 100%;
  height: 84px;
  border-radius: 16px 16px 0px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.Color.Gray[200]};
`;

export const UrlInfoWrapper = styled('div')<{ isAlone: boolean }>`
  height: 82px;
  background: ${({ theme }) => theme.Color.White[100]};
  border-radius: ${({ isAlone }) => (isAlone ? '16px' : '0px 0px 16px 16px')};
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
`;

export const UrlTitle = styled('div')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UrlDesc = styled('div')`
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 4px;
`;

export const UrlText = styled('div')`
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Blue[500]};
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 8px;
`;

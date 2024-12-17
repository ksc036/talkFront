import { styled } from '@wapl/ui';

export const LinkMenuButton = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  position: absolute;
  cursor: pointer;
  width: 40px;
  height: 40px;
  left: 200px;
`;

export const UrlWrapper = styled('div')<{ ogImageUrl: string | undefined }>`
  width: 240px;
  padding-top: ${({ ogImageUrl }) => (ogImageUrl ? '8px' : '0px')};
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const UrlImage = styled('img')`
  width: 240px;
  height: 84px;
  border-radius: 16px 16px 0px 0px;
  object-fit: cover;
`;

export const NoUrlImage = styled.div`
  width: 240px;
  height: 84px;
  border-radius: 16px 16px 0px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.Color.Gray[200]};
`;

export const UrlInfoWrapper = styled('div')<{ isAlone: boolean }>`
  height: 82px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.Color.White[100]};
  border-radius: ${({ isAlone }) => (isAlone ? '16px' : '0px 0px 16px 16px')};
  padding: 12px;
`;

export const UrlTitle = styled('div')`
  ${({ theme: { Font } }) => Font.Text.s.Regular};
  color: ${({ theme }) => theme.Color.Gray[900]};
  width: 216px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UrlDesc = styled('div')`
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ theme }) => theme.Color.Gray[600]};
  width: 216px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 4px;
`;

export const UrlText = styled('div')`
  ${({ theme: { Font } }) => Font.Text.xs.Regular};
  color: ${({ color }) => color};
  width: 216px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 8px;
`;

import { styled } from '@wapl/ui';

export const Layout = styled.div`
  min-width: 792px;
  width: 792px;
  max-width: 792px;
  height: 100vh;
  background-color: ${({ theme }) => theme.Color.Background[0]};
  border-left: 1px solid ${({ theme }) => theme.Color.Gray[200]};
`;

export const LinkBody = styled('div')`
  height: calc(100vh - 130px);

  .linkDrawerVirtuoso {
    overflow-x: hidden;
  }

  .linkDrawerVirtuoso::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  .linkDrawerVirtuoso::-webkit-scrollbar-track,
  .linkDrawerVirtuoso::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  .linkDrawerVirtuoso::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const Footer = styled.div`
  width: 100%;
  min-height: 56px;
  background-color: pink;
  display: flex;
`;

export const ListContainer = styled.div`
  width: 792px;
  padding: 0px 20px;
  display: grid;
  gap: 16px;
`;

export const NoLinkWrapper = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme: { Font } }) => Font.Text.m.Regular};
`;

import { styled } from '@wapl/ui';

export const PaperStyle = {
  width: '360px',
  height: '294px',
  borderRadius: '12px',
  overflow: 'hidden',
};

export const MenuStyle = {
  top: '-48px',
};

export const Wrapper = styled('div')`
  height: 294px;
  display: flex;
  flex-direction: column;
`;

export const ListWrapper = styled('div')`
  overflow: auto;
  flex: 1;
  display: grid;
  row-gap: 6px;
  column-gap: 10px;
  height: 249px;
  padding: 14px;

  ::-webkit-scrollbar {
    width: 12px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 4px solid transparent;
    border-radius: 12px;
    opacity: 1;
    background-color: ${({ theme: { Color } }) => Color.Gray[400]};
  }
`;

export const TabsWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 44.5px;
  padding: 0 12px;
`;

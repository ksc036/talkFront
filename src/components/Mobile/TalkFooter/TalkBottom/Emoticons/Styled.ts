import { styled } from '@wapl/ui';

export const PaperStyle = {
  width: '360px',
  height: '294px',
  borderRadius: '12px',
  overflow: 'hidden',
};

export const MenuStyle = {
  top: '-40px',
};

export const Wrapper = styled('div')`
  height: 230px; // 키보드 높이로
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
  background-color: ${({ theme }) => theme.Color.Background[0]};
`;

export const TabsWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px 0 6px;
  height: 44.5px;
  background: ${({ theme }) => theme.Color.Gray[100]};
`;

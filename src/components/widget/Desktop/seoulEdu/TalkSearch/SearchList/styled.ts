import { styled } from '@wapl/ui';

export const LoadingWrapper = styled('div')`
  width: 100%;
  height: 107px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchListDiv = styled('div')`
  max-height: 266px;
  width: 860px;
  border-radius: 12px;
  border: 1px solid #e8eaed;
`;

export const ListHeader = styled('div')`
  height: 62px;
  border-bottom: 1px solid #e8eaed;
  padding: 21px 36px;
`;

export const HeaderText = styled('h1')`
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
`;

export const NoSearchText = styled('h3')`
  height: 107px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  margin: 0;
  color: #80868b;
`;

export const ListWrapper = styled('div')`
  overflow-y: scroll;
  max-height: 203px;
`;

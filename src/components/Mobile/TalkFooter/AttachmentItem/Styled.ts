import { styled } from '@wapl/ui';

export const Wrapper = styled('div')`
  position: relative;
  min-width: 120px;
  min-height: 120px;
  width: 120px;
  height: 120px;
  border: 1px solid #dadce0;
  border-radius: 10px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background-size: cover;
  justify-content: center;
  vertical-align: top;
  box-sizing: border-box;
`;

export const ItemTitle = styled('div')`
  font-weight: 500;
  font-size: 12px;
  color: #202124;
  padding: 4px;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ItemInfo = styled('div')`
  font-weight: 400;
  font-size: 11px;
  color: #80868b;
  overflow: hidden;
`;

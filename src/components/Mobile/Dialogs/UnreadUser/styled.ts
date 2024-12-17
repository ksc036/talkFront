import { styled } from '@wapl/ui';

export const Wrapper = styled.div`
  height: 100%;
`;

export const Header = styled.div`
  width: 100%;
  height: 56px;
  padding: 15.5px, 207px, 15.5px, 16px;
`;

export const UnreadUserItemWrapper = styled.div`
  overflow-y: auto;
  width: 100%;
  height: calc(100% - 56px);
`;

export const UnreadUserItem = styled.div`
  width: 100%;
  height: 56px;
  padding-left: 16px;

  align-items: center;
  display: flex;
  strong {
    padding-left: 16px;
  }
`;

export const ListItemText = styled.strong`
  font-family: Spoqa Han Sans Neo !important;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`;

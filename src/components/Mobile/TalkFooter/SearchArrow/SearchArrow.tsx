import { Icon } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './style';

export const SearchArrow = observer(() => {
  const { messageStore } = useStore();

  const searchMessage = async () => {
    await messageStore.scrollToTargetMessageId(
      messageStore.searchResultIds[messageStore.searchIndex],
    );
  };

  const handleClickUp = async () => {
    messageStore.increaseSearchIndex();
    await searchMessage();
  };

  const handleClickDown = async () => {
    messageStore.decreaseSearchIndex();
    await searchMessage();
  };

  return (
    <S.SearchArrowWrapper>
      <div style={{ display: 'flex', marginRight: '12px' }}>
        <S.IconBtn
          onClick={handleClickUp}
          disabled={
            messageStore.searchResultIds.length === 0 ||
            messageStore.state === 'loading'
          }
        >
          <Icon.ArrowTopLine />
        </S.IconBtn>
        <S.IconBtn
          onClick={handleClickDown}
          disabled={
            messageStore.searchResultIds.length === 0 ||
            messageStore.state === 'loading'
          }
        >
          <Icon.ArrowBottomLine />
        </S.IconBtn>
      </div>
    </S.SearchArrowWrapper>
  );
});

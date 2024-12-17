import { MouseEvent } from 'react';

import { useTheme, Icon, Squircle } from '@wapl/ui';
import { observer } from 'mobx-react-lite';

import { useStore } from '@/stores';

import * as S from './styled';

const JoinLinkCopy = observer(() => {
  const { configStore, uiStore } = useStore();
  const { Color } = useTheme();

  const handleClickLinkShare = (event: MouseEvent<HTMLElement>) => {
    uiStore.openDialog('shareLink');
    uiStore.setRoomLinkShareAnchorEl(event.currentTarget);
  };

  return (
    <S.JoinLinkCopyWrapper onClick={handleClickLinkShare}>
      <Squircle
        size={36}
        color={Color.Gray[100]}
        icon={
          <Icon.ShareLine
            width={18}
            height={18}
            color={configStore.MainColor}
          />
        }
      />
      <S.RoomMenuText>
        {configStore.FeatureNameType.Room} 링크 공유
      </S.RoomMenuText>
    </S.JoinLinkCopyWrapper>
  );
});

export default JoinLinkCopy;

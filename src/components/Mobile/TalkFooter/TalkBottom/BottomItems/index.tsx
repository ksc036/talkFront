import { RoomModel, useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react-lite';

import Album from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Album';
import Camera from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Camera';
import Contact from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Contact';
import Drive from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Drive';
import File from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/File';
import Mail from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Mail';
import Notice from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Notice';
import Vote from '@/components/Mobile/TalkFooter/TalkBottom/BottomItems/Vote';
import Emoticons from '@/components/Mobile/TalkFooter/TalkBottom/Emoticons';
import { useStore } from '@/stores';
import { getRoomType } from '@/utils';

import Drawer from './Drawer';
import Reserve from './Reserve';
import * as S from './Styled';

const BottomItems = observer(() => {
  const { uiStore, configStore } = useStore();
  const { roomStore } = useCoreStore();
  if (uiStore.openEmoticonModal) return <Emoticons />;

  const roomType = getRoomType(
    roomStore.getRoomById(roomStore.currentRoomId as number) as RoomModel,
  );

  return (
    <S.Wrapper>
      {configStore.BottomItemsType.Album && <Album />}
      {configStore.BottomItemsType.Camera && <Camera />}
      {configStore.BottomItemsType.Drive && <Drive />}
      {configStore.BottomItemsType.Drawer && <Drawer />}
      {configStore.BottomItemsType.File && <File />}
      {configStore.BottomItemsType.Notice && <Notice />}
      {configStore.BottomItemsType.Vote && !roomType.isMyRoom && <Vote />}
      {configStore.BottomItemsType.Mail && <Mail />}
      {configStore.BottomItemsType.Contact && <Contact />}
      {configStore.BottomItemsType.Reserve && <Reserve />}
    </S.Wrapper>
  );
});

export default BottomItems;

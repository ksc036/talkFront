import { useEffect, useState } from 'react';

import { useCoreStore } from '@wapl/core';
import { observer } from 'mobx-react';

import { MessageModel } from '@/models';
import { useStore } from '@/stores';
import { hasLastLetter } from '@/utils';
import isDarkMode from '@/utils/darkModeDetect';

import * as S from './styled';

interface AutoMessageProps {
  message: MessageModel;
}

const AutoMessage = observer((props: AutoMessageProps) => {
  const { message } = props;
  const { personaStore, roomStore } = useCoreStore();
  const { configStore } = useStore();

  const [requestName, setRequestName] = useState<string>('');
  const [targetName, setTargetName] = useState<string>('');

  const content = () => {
    switch (message.msgBody.autoMsgType) {
      case 'room-create-Open':
        const roomCreateNameWithProposition =
          (message.msgBody.roomName ?? '') +
          (hasLastLetter(message.msgBody.roomName ?? '') ? '이' : '가');
        return `${roomCreateNameWithProposition} 생성되었습니다.`;
      case 'room-create-Private':
      case 'member-in-Private':
        return `${requestName}님이 ${targetName}님을 초대하였습니다.`;
      case 'member-in-Open':
        return `${targetName}님이 입장했습니다.`;
      case 'member-out':
      case 'member-out-Private':
      case 'member-out-Open':
        return `${requestName}님이 나갔습니다.`;
      case 'member-kick':
        return `${targetName}님을 내보냈습니다.`;
      case 'room-update':
        const roomUpdateNameWithProposition = `'${
          message.msgBody.roomName ?? ''
        }'${hasLastLetter(message.msgBody.roomName ?? '') ? '으로' : '로'}`;
        return `${configStore.FeatureNameType.Room} 이름이 ${roomUpdateNameWithProposition} 변경되었습니다.`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const getNames = async () => {
      const roomPersonaMap = roomStore.getRoomById(
        roomStore.currentRoomId as number,
      )?.memberMap;
      if (message.msgBody.requestId) {
        const personaIdNum = Number(message.msgBody.requestId);
        if (
          !roomPersonaMap?.get(personaIdNum) &&
          !personaStore.getPersona(personaIdNum)
        ) {
          await personaStore.fetchPersona({
            personaId: personaIdNum,
          });
        }
        if (roomPersonaMap?.get(personaIdNum))
          setRequestName(roomPersonaMap?.get(personaIdNum)?.personaNick ?? '');
        else setRequestName(personaStore.getPersona(personaIdNum)?.nick ?? '');
      }
      if (message.msgBody.memberList) {
        const requestIdNum = Number(message.msgBody.requestId);

        let memberIdList;

        if (message.msgBody.autoMsgType === 'member-in-Open') {
          memberIdList = message.msgBody.memberList;
        } else {
          memberIdList = message.msgBody.memberList
            ?.map((id) => Number(id))
            .filter((memberId) => memberId !== requestIdNum);
        }

        const targetIdList = memberIdList.filter(
          (memberId) =>
            !roomPersonaMap?.get(memberId) &&
            !personaStore.getPersona(memberId),
        );
        if (targetIdList.length > 0)
          await personaStore.fetchPersonaList({ personaIdList: targetIdList });

        const nameList = memberIdList
          .map((personaId) => {
            if (roomPersonaMap?.get(personaId))
              return roomPersonaMap?.get(personaId)?.personaNick ?? '';
            else return personaStore.getPersona(personaId)?.nick ?? '';
          })
          .join(', ');
        setTargetName(nameList);
      }
    };
    getNames();
    return () => {
      setRequestName('');
      setTargetName('');
    };
  }, []);

  return (
    <S.AutoMsgWrapper>
      <S.AutoMsgText
        className="AutoMessage"
        backgroundColor={
          isDarkMode() ? '#3C4043' : configStore.AutoMessageBackgroundColor
        }
        color={isDarkMode() ? 'white' : configStore.AutoMessageTextColor}
      >
        {content()}
      </S.AutoMsgText>
    </S.AutoMsgWrapper>
  );
});

export default AutoMessage;

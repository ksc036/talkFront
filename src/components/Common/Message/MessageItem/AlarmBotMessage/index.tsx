import { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { MessageModel } from '@/models';
import { generateRoleMessage, generateVOCMessage } from '@/utils';
import * as T from '@types';

import MetaTagMessage from '../MetaTagMessage';

interface AlarmBotMessageProps {
  msgBody: MessageModel['msgBody'];
  msgId: number;
  message: MessageModel;
}

const AlarmBotMessage = observer((props: AlarmBotMessageProps) => {
  const { msgBody, msgId } = props;
  const [botMsgTitle, setBotMsgTitle] = useState('');
  const [botMsgContent, setbotMsgContent] = useState('');
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    if (msgBody?.botType === 'voc') {
      setMinHeight(83);
      const { title, content } = generateVOCMessage(
        msgBody.vocType as T.VOCType,
        msgBody.vocBody?.vocId,
      );
      setBotMsgTitle(title);
      setbotMsgContent(content);
    } else if (msgBody?.botType === 'role') {
      setMinHeight(54);
      const getRoleMessage = async () => {
        const { title, content } = await generateRoleMessage(
          msgBody.roleType as T.RoleType,
          msgBody?.roleBody as T.RoleBody,
        );
        setBotMsgTitle(title);
        setbotMsgContent(content);
      };
      getRoleMessage();
    }
  }, []);
  return (
    <MetaTagMessage
      notiText={botMsgTitle}
      title={botMsgContent}
      msgId={msgId}
      hasBottom={false}
      minHeight={minHeight}
    />
  );
});

export default AlarmBotMessage;

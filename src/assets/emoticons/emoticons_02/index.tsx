import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_02';

const Emoticons02 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_01',
  EmoticonType.STICKER,
  {
    normal: E.EmoticonTabIcon2 as unknown as Base64,
    active: E.EmoticonTabActiveIcon2 as unknown as Base64,
  },
  <Icon.Emoji2Line />,
  <Icon.Emoji2Color />,
);

for (let i = 1; i <= 40; i++) {
  const num = i.toString().padStart(2, '0');
  Emoticons02.insertEmoticon(
    `emoticon_02_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_02_${num}.png`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_02_${num}.png`,
  );
}

export default Emoticons02;

import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_05';

const Emoticons05 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_03',
  EmoticonType.STICKER,
  {
    normal: E.EmoticonTabIcon5 as unknown as Base64,
    active: E.EmoticonTabActiveIcon5 as unknown as Base64,
  },
  <Icon.Emoji5Line />,
  <Icon.Emoji5Color />,
);

for (let i = 1; i <= 12; i++) {
  const num = i.toString().padStart(2, '0');
  Emoticons05.insertEmoticon(
    `emoticon_05_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_05_${i}.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_05_${i}_Thumbnail.png`,
  );
}

export default Emoticons05;

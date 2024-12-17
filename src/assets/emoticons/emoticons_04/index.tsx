import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_04';

const Emoticons04 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_04',
  EmoticonType.STICKER,
  {
    normal: E.EmoticonTabIcon4 as unknown as Base64,
    active: E.EmoticonTabActiveIcon4 as unknown as Base64,
  },
  <Icon.Emoji4Line />,
  <Icon.Emoji4Color />,
);

for (let i = 1; i <= 12; i++) {
  const num = i.toString().padStart(2, '0');
  Emoticons04.insertEmoticon(
    `emoticon_04_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_04_${i}.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_04_${i}_Thumbnail.png`,
  );
}

export default Emoticons04;

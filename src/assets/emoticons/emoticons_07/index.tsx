import { Icon } from '@wapl/ui';

import { Base64 } from '@/@types/common';
import { EmoticonType } from '@/@types/emoticon';
import { EmoticonModel } from '@/models';

import EmoticonOriginURL from '../EmoticonOriginURL';
import * as E from '../EmoticonStyles';

const emoticonTabIndex = 'emoticons/emoticons_07';

const Emoticons07 = new EmoticonModel(
  'TALK_SEND_DEEP_FEATURE_EMOTICON_TOOLTIP_07',
  EmoticonType.STICKER,
  {
    normal: E.EmoticonTabIcon7 as unknown as Base64,
    active: E.EmoticonTabActiveIcon7 as unknown as Base64,
  },
  <Icon.Emoji7Line />,
  <Icon.Emoji7Color />,
);

for (let i = 1; i <= 12; i++) {
  const num = i.toString().padStart(2, '0');
  Emoticons07.insertEmoticon(
    `emoticon_07_${num}`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_07_${i}.gif`,
    `${EmoticonOriginURL}/${emoticonTabIndex}/emoticon_07_${i}_Thumbnail.png`,
  );
}

export default Emoticons07;
